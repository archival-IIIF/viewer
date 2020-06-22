import Cache from '../lib/Cache';
import IManifestData, {IAuthService, IManifestReference, ISearchService} from '../interface/IManifestData';
import ManifestData from '../entity/ManifestData';
import ManifestDataThumnail from '../entity/ManifestDataThumbnail';
import ISequenze from '../interface/ISequenze';
import UrlValidation from '../lib/UrlValidation';
import Config from '../lib/Config';
import * as manifesto from 'manifesto.js';
import { ServiceProfile } from "@iiif/vocabulary/dist-commonjs";
import Token from "../lib/Token";
import {IIIFResource} from "manifesto.js";

declare let global: {
    config: Config;
};

class Manifest {

    static lang: string = 'en';

    static cache: any = {};
    static cacheSkipAuthentication: any = {};


    static get(url?: string, callback?: any, skipAuthentication?: boolean) {

        if (url === undefined || url === '') {
            return;
        }

        const data = this.fetchFromCache(url, skipAuthentication);

        if (data) {

            if (callback !== undefined) {
                callback(data);
            }

            return;
        }

        this.fetchFromUrl(url, callback, skipAuthentication);

    }

    static fetchFromUrl(url: string, callback: any, skipAuthentication?: boolean, token?: string) {

        if (!global.config.isAllowedOrigin(url)) {
            const alertArgs = {title: 'Error', body: 'The manifest url is not an allowed origin: ' + url};
            Cache.ee.emit('alert', alertArgs);
            return;
        }

        const t = this;
        const init: RequestInit = {};
        if (token) {
            const authHeader: Headers = new Headers();
            authHeader.set('Authorization', 'Bearer ' + token);
            init.headers = authHeader;
        }

        fetch(url, init).then((response) => {
            const statusCode = response.status;

            if (statusCode !== 401 && statusCode >= 400) {
                const alertArgs = {
                    title: 'Error',
                    body: 'Could not fetch manifest!\n\n'  + url
                };
                Cache.ee.emit('alert', alertArgs);
                return;
            }

            response.json().then((json) => {

                let manifestoData;
                manifestoData = manifesto.parseManifest(json);
                if (!manifestoData) {
                    const alertArgs = {
                        title: 'Error',
                        body: 'Manifest could not load!\n\n' + url
                    };
                    Cache.ee.emit('alert', alertArgs);
                    return;
                }

                const manifestData: IManifestData = new ManifestData();

                manifestData.id = manifestoData.id;
                manifestData.request = url !== response.url ? url : undefined;
                const type = manifestoData.getProperty('type');
                if (type === 'sc:Manifest' || type === 'Manifest') {
                    manifestData.type = 'Manifest';
                } else if (type === 'sc:Collection' || type === 'Collection') {
                    manifestData.type = 'Collection';
                }
                manifestData.label = manifestoData.getLabel() ?? '';
                const isV3 = this.isV3(manifestoData);
                if (isV3) {
                    const partOf = manifestoData.getProperty('partOf');
                    if (partOf && partOf.length > 0) {
                        manifestData.parentId = partOf[0].id;
                    }
                } else {
                    manifestData.parentId = manifestoData.getProperty('within');
                }
                manifestData.authService = this.getAuthService(manifestoData);

                if (!manifestData.label) {
                    const alertArgs = {
                        title: 'Error',
                        body: 'Manifest file does not contain a label!\n\n' + url
                    };
                    Cache.ee.emit('alert', alertArgs);
                    return;
                }

                if (!manifestData.id) {
                    const alertArgs = {
                        title: 'Error',
                        body: 'Manifest file does not contain an id!\n\n' + url
                    };
                    Cache.ee.emit('alert', alertArgs);
                    return;
                }

                if (statusCode === 401 || (url !== response.url && manifestData.authService)) {

                    if (token) {
                        const alertArgs = {
                            title: 'Login failed',
                            body: ''
                        };
                        Cache.ee.emit('alert', alertArgs);
                        return;
                    }
                    if (!manifestData.authService) {
                        const alertArgs = {
                            title: 'Login failed',
                            body: 'Auth service is missing!'
                        };
                        Cache.ee.emit('alert', alertArgs);
                        return;
                    }
                    if (!manifestData.authService.token) {
                        const alertArgs = {
                            title: 'Login failed',
                            body: 'Token service is missing!'
                        };
                        Cache.ee.emit('alert', alertArgs);
                        return;
                    }

                    const newToken = manifestData.authService.token;
                    if (Token.has(newToken)) {
                        this.fetchFromUrl(url, callback, false, Token.get(newToken));
                        return;
                    }

                    if (manifestData.authService.profile === ServiceProfile.AUTH_1_EXTERNAL) {
                        this.loginInExternal(manifestData.authService, url, callback);
                        return;
                    }

                    if (skipAuthentication === true) {
                        t.cacheSkipAuthentication[url] = manifestData;
                    } else {
                        Cache.ee.emit('show-login', manifestData.authService);
                        manifestData.collections = [];
                        manifestData.manifests = [];
                        manifestData.restricted = true;
                    }
                } else {
                    const isV3 = this.isV3(manifestoData);
                    manifestData.metadata = manifestoData.getMetadata();
                    manifestData.description = manifestoData.getDescription();
                    manifestData.license = t.getLicense(manifestoData);
                    manifestData.logo = manifestoData.getLogo();
                    manifestData.attribution = manifestoData.getRequiredStatement();
                    manifestData.manifestations = t.getManifestations(manifestoData);
                    manifestData.restricted = false;
                    if (manifestData.type === 'Collection') {
                        manifestData.manifests = t.getManifests(manifestoData);
                        manifestData.collections = t.getCollections(manifestoData);
                    } else if (manifestData.type === 'Manifest') {
                        manifestData.resource = t.getResource(manifestoData, isV3);
                    }
                    manifestData.search = t.getSearch(manifestoData);
                    manifestData.thumbnail = t.getThumbnail(manifestoData);
                    t.cache[manifestData.id] = manifestData;
                }


                if (callback !== undefined) {
                    callback(manifestData);
                }
            }).catch((err) => {
                console.log(err, url);
                const alertArgs = {
                    title: 'Error',
                    body: 'Could not read manifest!\n\n' + url
                };
                Cache.ee.emit('alert', alertArgs);
            });
        });
    }

    static loginInExternal(authService: IAuthService, url: string, callback?: any) {

        if (!authService.token) {
            return false;
        }
        const tokenId = authService.token;

        fetch(tokenId).then((externalTokenResponse) => {
            const statusCode = externalTokenResponse.status;
            if (statusCode !== 200) {
                const alertArgs = {
                    title: authService.failureHeader,
                    body: authService.errorMessage
                };
                Cache.ee.emit('alert', alertArgs);
                return;
            }

            externalTokenResponse.json()
                .then((externalTokenJson: any) => {
                    Token.set(externalTokenJson, tokenId, authService.logout);
                    return this.fetchFromUrl(url, callback, false, Token.get(tokenId));
                });
        });

        return true;
    }

    static getAuthService(manifestoData: IIIFResource): IAuthService | undefined {

        const serviceProfiles = [
            ServiceProfile.AUTH_1_EXTERNAL,
            ServiceProfile.AUTH_1_KIOSK,
            ServiceProfile.AUTH_1_CLICK_THROUGH,
            ServiceProfile.AUTH_1_LOGIN
        ]

        let authService;
        let profile = '';
        let id = '';
        for (const serviceProfile of serviceProfiles) {
            authService = manifestoData.getService(serviceProfile);
            if (authService) {
                profile = serviceProfile;
                id = authService.id;
                break;
            }
        }
        if (!authService) {
            return undefined;
        }

        const tokenService = authService.getService(ServiceProfile.AUTH_1_TOKEN);

        const logoutService = authService.getService(ServiceProfile.AUTH_1_LOGOUT);

        return {
            token: tokenService ? tokenService.id : undefined,
            logout: logoutService ? logoutService.id : undefined,
            confirmLabel: authService.getConfirmLabel(),
            description: authService.getDescription(),
            errorMessage: authService.getFailureDescription(),
            header: authService.getHeader(),
            failureHeader: authService.getFailureHeader(),
            profile,
            id
        };
    }

    static getSearch(manifestoData: IIIFResource): ISearchService | undefined {
        const searchService = manifestoData.getService(ServiceProfile.SEARCH_0);
        if (searchService) {
            return {
                id: searchService.id
            }
        }

        return undefined;
    }

    static getLicense(manifestoData: IIIFResource): string | null {
        let license: string | null;
        if (this.isV3(manifestoData)) {
            license = manifestoData.getProperty('rights');
        } else {
            license = manifestoData.getLicense();
        }

        if (!license || !UrlValidation.isURL(license)) {
            return null;
        }

        return license;
    }

    static getResource(manifestoData: any, isV3: boolean) {

        const resource = {
            source: null,
            type: null
        };



        if (typeof manifestoData.getSequenceByIndex !== 'function') {
            return resource;
        }

        const sequence0 = manifestoData.getSequenceByIndex(0);
        if (sequence0 === undefined) {
            return resource;
        }


        if (isV3) {
            const iiif3Resource = this.getIIF3Resource(sequence0);
            if (iiif3Resource !== false) {
                return iiif3Resource;
            }
        } else {
            const imageResources = this.getImageResources(sequence0);
            if (imageResources !== false) {
                return imageResources;
            }

            const audioVideoResource = this.getAudioVideoResource(sequence0);
            if (audioVideoResource !== false) {
                return audioVideoResource;
            }

            const fileResource = this.getFileResource(sequence0);
            if (fileResource) {
                return fileResource;
            }
        }


        return resource;
    }

    static getManifestations(manifestoData: IIIFResource) {

        const manifestations = [];

        const renderings = manifestoData.getRenderings();
        for (const i in renderings) {
            if (renderings.hasOwnProperty(i)) {
                const rendering = renderings[i];
                const manifestation = {
                    label: rendering.getLabel(),
                    url: rendering.id,
                };
                manifestations.push(manifestation);
            }
        }

        return manifestations;
    }

    static getAudioVideoResource(sequence0: ISequenze) {
        if (!sequence0.__jsonld) {
            return false;
        }

        const jsonld: any = sequence0.__jsonld;
        if (!jsonld.hasOwnProperty('elements')) {
            return false;
        }

        const element0: any = jsonld['elements'][0];
        if (element0 === undefined) {
            return false;
        }

        if (!element0.hasOwnProperty('format')) {
            return false;
        }

        const mime = element0.format;
        const mediaType = mime.substr(0, 5);
        if (mediaType !== 'audio' && mediaType !== 'video') {
            return false;
        }

        if (element0['@id'] === null) {
            return false;
        }

        return {
            id: element0['@id'],
            format: mime,
            type: mediaType
        };
    }

    static getIIF3Resource(sequence0: any) {

        const images = [];
        for (const canvas of sequence0.getCanvases()) {
            try {
                const source = canvas.getContent()[0].getBody()[0];
                if (
                    source.getType().toLowerCase() === 'video' ||
                    source.getFormat().substr(0, 5) === 'video'
                ) {
                    return {
                        format: source.getFormat(),
                        id: source.id,
                        type: 'video',
                        manifestations: this.getManifestations(canvas)
                    };
                }
                if (
                    source.getType().toLocaleLowerCase() === 'sound' ||
                    source.getType().toLocaleLowerCase() === 'audio' ||
                    source.getFormat().substr(0, 5) === 'audio'
                ) {
                    return {
                        format: source.getFormat(),
                        id: source.id,
                        type: 'audio',
                        manifestations: this.getManifestations(canvas)
                    };
                }
                if (source.getFormat().toLowerCase() === 'application/pdf') {
                    return {
                        format: 'application/pdf',
                        id: source.id,
                        type: 'pdf',
                        manifestations: this.getManifestations(canvas)
                    };
                }
                if (source.getFormat().toLowerCase() === 'text/plain') {
                    return {
                        format: 'text/plain',
                        id: source.id,
                        type: 'plainText',
                    };
                }

                if (source.getType() === 'image') {
                    const profiles = [
                        'level2',
                        'level3',
                        'http://iiif.io/api/image/2/level2.json',
                        'http://iiif.io/api/image/2/level2.json'
                    ]
                    for(const profile of profiles) {
                        const service = source.getService(profile);
                        if (service) {
                            images.push({
                                id: service.id,
                                on: canvas.id,
                                width: canvas.getWidth()
                            });
                            break;
                        }
                    }

                } else {
                    return {
                        format: source.getFormat(),
                        id: source.id,
                        type: 'file'
                    };
                }

            } catch (e) {
                return false;
            }
        }
        if (images.length > 0) {
            return {
                source: images,
                type: 'imageService'
            };
        }

        return false;
    }


    static getFileResource(sequence0: any) {
        try {
            const element = sequence0.getCanvasByIndex(0)
            const id = element.id;
            const format = element.__jsonld.format;
            if (format === 'application/pdf') {
                return {
                    id,
                    type: 'pdf',
                    format,
                    manifestations: this.getManifestations(element)
                };
            }
            if (format === 'text/plain') {
                return {
                    id,
                    type: 'plainText',
                    format
                };
            }
            return {
                id,
                type: 'file',
                format,
                manifestations: this.getManifestations(element)
            };
        } catch (e) {}

        return null;
    }


    static getImageResources(sequence0: any) {

        const sources: any = [];
        for (const canvases of sequence0.getCanvases()) {

            let images = canvases.getImages();
            if (images === undefined || images.length === 0) {
                continue;
            }
            const image0 = images[0];


            let resource = image0.getResource();


            if (resource === undefined || !resource.id) {
                continue;
            }

            let service = resource.getService('http://iiif.io/api/image/2/level2.json');
            if (!service) {
                service = resource.getService('http://iiif.io/api/image/2/level1.json');
                if (!service) {
                    continue;
                }
            }

            if (service.hasOwnProperty('id') === undefined) {
                continue;
            }

            sources.push({
                id: service.id,
                on: image0.getOn(),
                width: canvases.getWidth()
            });
        }

        if (sources.length === 0) {
            return false;
        }

        return {
            source: sources,
            type: 'imageService'
        };
    }

    static getThumbnail(manifestoData: any) {

        const manifestoThumbnail = manifestoData.getThumbnail();
        if (manifestoThumbnail === undefined ||
            manifestoThumbnail === null ||
            !manifestoThumbnail.hasOwnProperty('id')) {
            return undefined;
        }

        const thumbnail = new ManifestDataThumnail();
        thumbnail.id = manifestoThumbnail.id;

        const services = [
            ServiceProfile.IMAGE_2_LEVEL_2,
            'level2'
        ];
        for (const service of services) {
            let thumbnailService = manifestoThumbnail.getService(service);
            if (thumbnailService !== null && thumbnailService.hasOwnProperty('id')) {
                thumbnail.service = thumbnailService.id;
                return thumbnail;
            }
        }

        return thumbnail;
    }

    static getManifests(manifestoData: any): IManifestReference[] {

        const manifestoManifests = manifestoData.getManifests();
        if (manifestoManifests.length === 0) {
            return [];
        }

        const manifests = [];
        for (const key in manifestoManifests) {
            if (manifestoManifests.hasOwnProperty(key)) {
                const manifestoManifest = manifestoManifests[key];
                manifests.push({
                    id: manifestoManifest.id,
                    label: manifestoManifest.getLabel(),
                    thumbnail: this.getThumbnail(manifestoManifest),
                    type: manifestoManifest.getProperty('type')
                });
            }
        }

        return manifests;
    }

    static getCollections(manifestoData: any): IManifestReference[] {
        const manifestoCollections = manifestoData.getCollections();
        if (manifestoCollections.length === 0) {
            return [];
        }

        const collections: IManifestReference[] = [];
        for (const key in manifestoCollections) {
            if (manifestoCollections.hasOwnProperty(key)) {
                const manifestoManifest = manifestoCollections[key];
                collections.push({
                    id: manifestoManifest.id,
                    label: manifestoManifest.getLabel(),
                    thumbnail: this.getThumbnail(manifestoManifest),
                    type: manifestoManifest.getProperty('type').replace('sc:', '')
                });
            }
        }

        return collections;
    }

    static fetchFromCache(url: string, skipAuthentication?: boolean) {

        if (this.cache.hasOwnProperty(url)) {
            return this.cache[url];
        }

        if (skipAuthentication === true && this.cacheSkipAuthentication.hasOwnProperty(url)) {
            return this.cacheSkipAuthentication[url];
        }

        return false;
    }

    static getIdFromCurrentUrl() {
        let manifestUri = this.getGetParameter('manifest', window.location.href);

        if (!manifestUri || manifestUri === '') {
            manifestUri = global.config.getManifest();
        }

        if (!manifestUri || manifestUri === '') {
            return undefined;
        }

        return manifestUri;
    }

    static clearCache() {
        this.cache = {};
    }

    static getGetParameter(name: string, url: string) {
        const urlObject = new URL(window.location.href);
        return urlObject.searchParams.get(name);
    }

    static isV3(manifestoData: IIIFResource) {
        const context: any = manifestoData.context;

        if (typeof context === 'string') {
            return context === 'http://iiif.io/api/presentation/3/context.json';
        }

        if (context && typeof context.includes === 'function') {
            return context.includes('http://iiif.io/api/presentation/3/context.json');
        }

        return false;
    }


}

export default Manifest;
