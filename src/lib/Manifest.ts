import Cache from './Cache';

const manifesto = require('manifesto.js');
import filesize from 'file-size';
import i18n from 'i18next';
import IManifestData from '../interface/IManifestData';
import ManifestData from '../entity/ManifestData';
import ManifestDataThumnail from '../entity/ManifestDataThumbnail';
import ISequenze from '../interface/ISequenze';

class Manifest {

    static lang;

    static cache = {};

    static get(url, callback) {

        if (url === undefined) {
            return;
        }

        const data = this.fetchFromCache(url);

        if (data !== false) {

            if (callback !== undefined) {
                callback(data);
            }

            return;
        }

        this.fetchFromUrl(url, callback);

    }

    static fetchFromUrl(url, callback) {

        const t = this;
        const authHeader: Headers = new Headers();
        let statusCode = 0;
        let responseHeaderContentLanguage;
        if (Cache.token !== '') {
            authHeader.set('Authorization', 'Bearer ' + Cache.token);
        }

        fetch(url, {
                headers: authHeader
            }
        ).then((response) => {
            statusCode = response.status;
            responseHeaderContentLanguage = response.headers.get('content-language');

            if (statusCode !== 401 && statusCode >= 400) {
                alert('Could not fetch manifest!\n' + url);
                return;
            }

            response.json().then((json) => {

                if (!t.lang) {
                    t.lang = responseHeaderContentLanguage ? responseHeaderContentLanguage :
                        window.navigator.language;
                    i18n.changeLanguage(t.lang);
                }

                let manifestoData;
                manifestoData = manifesto.create(json);

                const manifestData: IManifestData = new ManifestData();

                manifestData.id = manifestoData.id;
                const type = manifestoData.getProperty('type');
                if (type === 'sc:Manifest' || type === 'Manifest') {
                    manifestData.type = 'sc:Manifest';
                } else if (type === 'sc:Collection' || type === 'Collection') {
                    manifestData.type = 'sc:Collection';
                } else {
                    alert('Manifest type must be a collection or a manifest!\n' + url);
                    return;
                }
                manifestData.label = manifestoData.getDefaultLabel();
                manifestData.parentId = manifestoData.getProperty('within');

                if (!manifestData.label) {
                    alert('Manifest file does not contain a label!\n' + url);
                    return;
                }

                if (!manifestData.id) {
                    alert('Manifest file does not contain an id!\n' + url);
                    return;
                }

                if (statusCode === 401) {
                    Cache.ee.emitEvent('show-login', [manifestoData]);
                    manifestData.collections = [];
                    manifestData.manifests = [];
                    manifestData.restricted = true;
                } else {
                    manifestData.metadata = t.getMetadata(manifestoData);
                    manifestData.license = t.getLicense(manifestoData);
                    manifestData.logo = manifestoData.getLogo();
                    manifestData.attribution = t.getAttribution(manifestoData);
                    manifestData.manifestations = t.getManifestations(manifestoData);
                    manifestData.restricted = false;
                    if (manifestData.type === 'sc:Collection') {
                        manifestData.manifests = t.getManifests(manifestoData);
                        manifestData.collections = t.getCollections(manifestoData);
                    } else if (manifestData.type === 'sc:Manifest') {
                        manifestData.resource = t.getResource(manifestoData);
                    }
                    manifestData.thumbnail = t.getThumbnail(manifestoData);

                    t.cache[url] = manifestData;
                }

                if (callback !== undefined) {
                    callback(manifestData);
                }
            }).catch((err) => {
                console.log(err);
                alert('Could not read manifest!\n' + url);
            });
        });
    }

    static getAttribution(manifestoData) {
        const manifestoAttribution = manifestoData.getRequiredStatement();

        try {
            return manifestoAttribution.value[0].value;
        } catch (e) {
        }

        return undefined;
    }

    static getMetadata(manifestoData) {
        const manifestoMetadata = manifestoData.getMetadata();
        const metadata = [];

        if (manifestoMetadata === undefined || manifestoMetadata === null) {
            return undefined;
        }

        for (const i in manifestoMetadata) {

            if (manifestoData.hasOwnProperty(i)) {
                let label;
                let value;
                try {
                    label = manifestoMetadata[i].label[0].value;
                } catch (e) {
                }
                try {
                    value = manifestoMetadata[i].value[0].value;
                } catch (e) {
                }

                if (label === 'Size') {
                    value = filesize(parseInt(value, 10)).human('si');
                }
                value = this.addBlankTarget(value);

                metadata.push({label, value});
            }
        }

        return metadata;
    }

    static getLicense(manifestoData) {
        const license = manifestoData.getLicense();
        if (license === undefined || !this.isURL(license)) {
            return undefined;
        }

        return license;
    }

    static getResource(manifestoData) {

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

        const imageResource = this.getImageResource(sequence0);
        if (imageResource !== false) {
            return imageResource;
        }

        const audioVideoResource = this.getAudioVideoResource(sequence0);
        if (audioVideoResource !== false) {
            return audioVideoResource;
        }

        const fileResource = this.getFileResource(sequence0);
        if (fileResource) {
            return fileResource;
        }

        return resource;
    }

    static getManifestations(manifestoData) {

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

        const jsonld = sequence0.__jsonld;
        if (!jsonld.hasOwnProperty('elements')) {
            return false;
        }

        const element0 = jsonld['elements'][0];
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
            source: element0,
            type: 'audioVideo'
        };
    }


    static getFileResource(sequence0) {


        try {
            const source = sequence0.getCanvasByIndex(0).getContent()[0].getBody()[0].id;
            return {
                source,
                type: 'file'
            };
        } catch (e) {
        }

        try {
            const source = sequence0.getCanvasByIndex(0).id;
            return {
                source,
                type: 'file'
            };
        } catch (e) {
        }

        return null;
    }


    static getImageResource(sequence0) {

        const canvases0 = sequence0.getCanvasByIndex(0);
        if (canvases0 === undefined) {
            return false;
        }

        const images = canvases0.getImages();
        if (images === undefined || images.length === 0) {
            return false;
        }
        const image0 = images[0];

        const resource = image0.getResource();
        if (resource === undefined) {
            return false;
        }

        let service = resource.getService('http://iiif.io/api/image/2/level2.json');
        if (!service) {
            service = resource.getService('http://iiif.io/api/image/2/level1.json');
            if (!service) {
                return false;
            }
        }

        if (service.hasOwnProperty('id') === undefined) {
            return false;
        }

        return {
            source: service.id,
            type: 'imageService'
        };
    }

    static getThumbnail(manifestoData) {

        const manifestoThumbnail = manifestoData.getThumbnail();
        if (manifestoThumbnail === undefined ||
            manifestoThumbnail === null ||
            !manifestoThumbnail.hasOwnProperty('id')) {
            return undefined;
        }

        const thumbnail = new ManifestDataThumnail();
        thumbnail.id = manifestoThumbnail.id;

        const thumbnailService = manifestoThumbnail.getService('http://iiif.io/api/image/2/level2.json');
        if (thumbnailService !== null && thumbnailService.hasOwnProperty('id')) {
            thumbnail.service = thumbnailService.id;
        }

        return thumbnail;
    }

    static getManifests(manifestoData) {

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

    static getCollections(manifestoData) {
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

    static addBlankTarget(input) {
        const tmp = document.createElement('div');
        tmp.innerHTML = input;
        for (let i = 0; i < tmp.children.length; i++) {
            if (tmp.children[i].nodeName === 'A') {
                tmp.children[i]['target'] = '_blank';
            }
        }
        return tmp.innerHTML;
    }


    static isURL(str) {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return pattern.test(str);
    }


    static fetchFromCache(url) {

        if (this.cache.hasOwnProperty(url)) {
            return this.cache[url];
        }

        return false;
    }

    static getIdFromCurrentUrl() {

        const url = new URL(window.location.href);
        const manifestUri = url.searchParams.get('manifest');

        if (manifestUri === '') {
            return false;
        }

        return manifestUri;
    }

    static clearCache() {
        this.cache = {};
    }
}

export default Manifest;
