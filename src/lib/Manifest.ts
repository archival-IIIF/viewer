import Cache from './Cache';
import filesize from 'filesize';
import IManifestData from '../interface/IManifestData';
import ManifestData from '../entity/ManifestData';
import ManifestDataThumnail from '../entity/ManifestDataThumbnail';
import ISequenze from '../interface/ISequenze';
import UrlValidation from './UrlValidation';
import Config from './Config';
import * as manifesto from 'manifesto.js';
import { ServiceProfile } from "@iiif/vocabulary/dist-commonjs";
import Token from "./Token";

declare let global: {
    config: Config;
};

class Manifest {

    static lang: string = 'en';

    static cache: any = {};
    static cacheSkipAuthentication: any = {};


    static get(url?: string, callback?: any, skipAuthentication?: boolean) {

        if (url === undefined) {
            return;
        }

        const data = this.fetchFromCache(url, skipAuthentication);

        if (data !== false) {

            if (callback !== undefined) {
                callback(data);
            }

            return;
        }

        this.fetchFromUrl(url, callback, skipAuthentication);

    }

    static fetchFromUrl(url: string, callback: any, skipAuthentication?: boolean) {

        console.log(url)

        const t = this;
        const authHeader: Headers = new Headers();
        let statusCode = 0;
        if (Token.has()) {
            authHeader.set('Authorization', 'Bearer ' + Token.get());
        }

        fetch(url, {
                headers: authHeader
            }
        ).then((response) => {
            statusCode = response.status;

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
                const type = manifestoData.getProperty('type');
                if (type === 'sc:Manifest' || type === 'Manifest') {
                    manifestData.type = 'sc:Manifest';
                } else if (type === 'sc:Collection' || type === 'Collection') {
                    manifestData.type = 'sc:Collection';
                }
                manifestData.label = manifestoData.getDefaultLabel() ?? '';
                const isV3 = this.isV3(manifestoData);
                if (isV3) {
                    const partOf = manifestoData.getProperty('partOf');
                    if (partOf && partOf.length > 0) {
                        manifestData.parentId = partOf[0].id;
                    }
                } else {
                    manifestData.parentId = manifestoData.getProperty('within');
                }

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


                if (statusCode === 401) {

                    const external = manifestoData.getService(ServiceProfile.AUTH_1_EXTERNAL);
                    if (external) {
                        const token = external.getService(ServiceProfile.AUTH_1_TOKEN);
                        if (token) {
                            fetch(token.id)
                                .then((externalTokenResponse) => {

                                    statusCode = externalTokenResponse.status;
                                    if (statusCode !== 200) {
                                        const alertArgs = {
                                            title: external.getFailureHeader(),
                                            body: external.getFailureDescription()
                                        };
                                        Cache.ee.emit('alert', alertArgs);
                                        return;
                                    }

                                    externalTokenResponse.json()
                                        .then((externalTokenJson: any) => {
                                            Token.set(externalTokenJson)
                                            return this.fetchFromUrl(url, callback, skipAuthentication);
                                        });
                                });
                            return;
                        }
                    }

                    if (skipAuthentication === true) {
                        t.cacheSkipAuthentication[url] = manifestData;
                    } else {
                        Cache.ee.emit('show-login', manifestoData);
                        manifestData.collections = [];
                        manifestData.manifests = [];
                        manifestData.restricted = true;
                    }
                } else {
                    const isV3 = this.isV3(manifestoData);
                    manifestData.metadata = t.getMetadata(manifestoData);
                    manifestData.description = t.getDescription(manifestoData);
                    manifestData.license = t.getLicense(manifestoData);
                    manifestData.logo = manifestoData.getLogo();
                    manifestData.attribution = t.getAttribution(manifestoData);
                    manifestData.manifestations = t.getManifestations(manifestoData);
                    manifestData.restricted = false;
                    if (manifestData.type === 'sc:Collection') {
                        manifestData.manifests = t.getManifests(manifestoData);
                        manifestData.collections = t.getCollections(manifestoData);
                    } else if (manifestData.type === 'sc:Manifest') {
                        manifestData.resource = t.getResource(manifestoData, isV3);
                    }
                    manifestData.thumbnail = t.getThumbnail(manifestoData);

                    t.cache[url] = manifestData;
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

    static getAttribution(manifestoData: any) {
        const manifestoAttribution = manifestoData.getRequiredStatement();

        try {
            return manifestoAttribution.value[0].value;
        } catch (e) {
        }

        return undefined;
    }

    static getDescription(manifestoData: any) {
        const description = manifestoData.getDescription();

        try {
            return description[0].value;
        } catch (e) {
        }

        return undefined;
    }

    static getMetadata(manifestoData: any) {
        const manifestoMetadata = manifestoData.getMetadata();
        const metadata = [];

        if (manifestoMetadata === undefined || manifestoMetadata === null) {
            return undefined;
        }


        for (const element of manifestoMetadata) {
            try {
                const label = element.label[0].value;
                let value = element.value[0].value;
                if (label === 'Size') {
                    value = filesize(parseInt(value, 10));
                }
                value = this.addBlankTarget(value);

                metadata.push({label, value});
            } catch (e) {}
        }

        return metadata;
    }

    static getLicense(manifestoData: any) {
        let license: string|undefined;
        if (this.isV3(manifestoData)) {
            license = manifestoData.getProperty('rights');
        } else {
            license = manifestoData.getLicense();
        }

        if (license === undefined || !UrlValidation.isURL(license)) {
            return undefined;
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

    static getManifestations(manifestoData: any) {

        const manifestations = [];

        const renderings = manifestoData.getRenderings();
        for (const i in renderings) {
            if (renderings.hasOwnProperty(i)) {
                const rendering = renderings[i];
                const manifestation = {
                    label: rendering.getDefaultLabel(),
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
                            images.push(service.id);
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

            sources.push(service.id);
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
            'http://iiif.io/api/image/2/level2.json',
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

    static getManifests(manifestoData: any) {

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
                    label: manifestoManifest.getDefaultLabel(),
                    thumbnail: this.getThumbnail(manifestoManifest),
                    type: manifestoManifest.getProperty('type')
                });
            }
        }

        return manifests;
    }

    static getCollections(manifestoData: any) {
        const manifestoCollections = manifestoData.getCollections();
        if (manifestoCollections.length === 0) {
            return [];
        }

        const collections = [];
        for (const key in manifestoCollections) {
            if (manifestoCollections.hasOwnProperty(key)) {
                const manifestoManifest = manifestoCollections[key];
                collections.push({
                    id: manifestoManifest.id,
                    label: manifestoManifest.getDefaultLabel(),
                    thumbnail: this.getThumbnail(manifestoManifest),
                    type: manifestoManifest.getProperty('type')
                });
            }
        }

        return collections;
    }

    static addBlankTarget(input: string) {
        const tmp: HTMLDivElement = document.createElement('div');
        tmp.innerHTML = input;
        for (let i: number = 0; i < tmp.children.length; i++) {
            let child: Element | null = tmp.children.item(i);
            if (child) {
                if (child.nodeName === 'A') {
                    child.setAttribute('target', '_blank');
                    child.setAttribute('rel', 'noopener');
                }
            }
        }
        return tmp.innerHTML;
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
            return false;
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

    static isV3(manifestoData: any) {
        const context = manifestoData.context;

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
