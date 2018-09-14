import manifesto from 'manifesto.js';
import filesize from 'file-size';

class Manifest {

    static cache = {};

    static get(url, callback) {

        let data = this.fetchFromCache(url);

        if (data !== false) {

            if (callback !== undefined) {
                callback(data);
            }

            return;
        }

        this.fetchFromUrl(url, callback)

    }

    static fetchFromUrl(url, callback) {

        let t  = this;
        let headers = {};
        let statusCode = 0;
        if (global.token !== '') {
            headers.Authorization = 'Bearer ' + global.token;
        }

        fetch(url, {
                headers: headers
            }
        ).then((response) => {
            statusCode = response.status;
            return response.json();
        }).then((json) => {
            if (json !== undefined) {

                if (statusCode === 401) {
                    global.ee.emitEvent('show-login', [json.service]);
                    return;
                }

                let manifestoData =  manifesto.create(json);

                let manifestData = {};
                manifestData.id = manifestoData.id;
                manifestData.metadata = this.getMetadata(manifestoData);
                manifestData.license = this.getLicense(manifestoData);
                manifestData.label = manifestoData.getDefaultLabel();
                manifestData.type = manifestoData.getProperty('type');
                manifestData.logo = manifestoData.getLogo();
                manifestData.attribution = this.getAttribution(manifestoData);
                manifestData.parentId = manifestoData.getProperty('within');
                if (manifestData.type === "sc:Collection") {
                    manifestData.manifests = this.getManifests(manifestoData);
                    manifestData.collections = this.getCollections(manifestoData);
                } else {
                    manifestData.resource = this.getResource(manifestoData);
                }
                manifestData.thumbnail = this.getThumbnail(manifestoData);

                t.cache[url] = manifestData;

                if (callback !== undefined) {
                    callback(manifestData);
                }
            }
        });

    }

    static getAttribution(manifestoData) {
        let manifestoAttribution = manifestoData.getRequiredStatement();

        try {
            return manifestoAttribution.value[0].value;
        } catch (e) {

        }

        return undefined;
    }

    static getMetadata(manifestoData) {
        let manifestoMetadata = manifestoData.getMetadata();
        let metadata = {};

        if (manifestoMetadata === undefined || manifestoMetadata === null) {
            return undefined;
        }

        for (let i in manifestoMetadata) {

            if (!manifestoMetadata[i].hasOwnProperty('label') || !manifestoMetadata[i].hasOwnProperty('value')) {
                continue;
            }

            let label = manifestoMetadata[i].label[0].value;
            let value = manifestoMetadata[i].value[0].value;
            if (label === 'Size') {
                value = filesize(parseInt(value, 10)).human('si');
            }
            value = this.addBlankTarget(value);

            metadata[label] = value;
        }

        return metadata;
    }

    static getLicense(manifestoData) {
        let license = manifestoData.getLicense();
        if (license === undefined || !this.isURL(license)) {
           return undefined
        }

        return license;
    }

    static getResource(manifestoData) {

        let resource = {
            type: null,
            source: null
        };

        if (typeof manifestoData.getSequenceByIndex !== 'function') {
            return resource;
        }

        let sequence0 = manifestoData.getSequenceByIndex(0);
        if (sequence0 === undefined) {
            return resource;
        }

        let imageResource = this.getImageResource(sequence0);
        if (imageResource !== false) {
            return imageResource;
        }

        let audioVideoResource = this.getAudioVideoResource(sequence0);
        if (audioVideoResource !== false) {
            return audioVideoResource;
        }

        let fileResoure = this.getFileResource(sequence0);
        if (fileResoure !== false) {
            return fileResoure;
        }

        return resource;
    }

    static getAudioVideoResource(sequence0) {
        if (!sequence0.hasOwnProperty('__jsonld')) {
            return false;
        }

        let jsonld = sequence0['__jsonld'];
        if (!jsonld.hasOwnProperty('elements')) {
            return false;
        }

        let element0 = jsonld.elements[0];
        if (element0 === undefined) {
            return false;
        }

        if (!element0.hasOwnProperty("format")) {
            return false;
        }

        let mime = element0.format;
        let mediaType = mime.substr(0, 5);
        if (mediaType !== "audio" && mediaType !== "video") {
            return false;
        }

        if (element0["@id"] === null) {
            return false;
        }

        return {
            type: 'audioVideo',
            source: element0
        }
    }


    static getFileResource(sequence0) {
        if (!sequence0.hasOwnProperty('__jsonld')) {
            return false;
        }

        let jsonld = sequence0['__jsonld'];
        if (!jsonld.hasOwnProperty('elements')) {
            return false;
        }

        let element0 = jsonld.elements[0];
        if (element0 === undefined) {
            return false;
        }

        if (!element0.hasOwnProperty("format")) {
            return false;
        }

        if (element0["@id"] === null) {
            return false;
        }

        return {
            type: 'file',
            source: element0["@id"]
        }
    }



    static getImageResource(sequence0) {

        let canvases0 = sequence0.getCanvasByIndex(0);
        if (canvases0 === undefined) {
            return false;
        }

        let images = canvases0.getImages();
        if (images === undefined || images.length === 0) {
            return false;
        }
        let image0 = images[0];

        let resource = image0.getResource();
        if (resource === undefined) {
            return false;
        }

        let service = resource.getService("http://iiif.io/api/image/2/level2.json");

        if (service === undefined) {
            return false;
        }

        if (service.hasOwnProperty('id') === undefined) {
            return false;
        }

        return {
            type: 'imageService',
            source: service.id
        }
    }

    static getThumbnail(manifestoData) {

        let manifestoThumbnail = manifestoData.getThumbnail();
        if (manifestoThumbnail === undefined || manifestoThumbnail === null || !manifestoThumbnail.hasOwnProperty('id')) {
            return undefined
        }

        let thumbnail = {
            id: manifestoThumbnail.id
        };

        let thumbnailService = manifestoThumbnail.getService('http://iiif.io/api/image/2/level2.json');
        if (thumbnailService !== null && thumbnailService.hasOwnProperty('id')) {
            thumbnail.service = thumbnailService.id
        }

        return thumbnail;
    }

    static getManifests(manifestoData) {

        let manifestoManifests = manifestoData.getManifests();



        if (manifestoManifests.length === 0) {
            return [];
        }


        let manifests = [];
        for (let key in manifestoManifests) {
            let manifestoManifest = manifestoManifests[key];
            manifests.push({
                id: manifestoManifest.id,
                label: manifestoManifest.getDefaultLabel(),
                type: manifestoManifest.getProperty('type'),
                thumbnail: this.getThumbnail(manifestoManifest)
            });
        }

        return manifests;
    }

    static getCollections(manifestoData) {
        let manifestoCollections = manifestoData.getCollections();
        if (manifestoCollections.length === 0) {
            return [];
        }

        let collections = [];
        for (let key in manifestoCollections) {
            let manifestoManifest = manifestoCollections[key];
            collections.push({
                id: manifestoManifest.id,
                label: manifestoManifest.getDefaultLabel(),
                type: manifestoManifest.getProperty('type'),
                thumbnail: this.getThumbnail(manifestoManifest)
            });
        }

        return collections;
    }

    static addBlankTarget(input){
        let tmp = document.createElement('div');
        tmp.innerHTML = input;
        for (let i = 0; i < tmp.children.length; i++) {
            if (tmp.children[i].nodeName === 'A') {
                tmp.children[i].target = '_blank'
            }
        }
        return tmp.innerHTML;
    }



    static isURL(str) {
        let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return pattern.test(str);
    }



    static fetchFromCache(url) {

        if (this.cache.hasOwnProperty(url)) {
            return this.cache[url];
        }

        return false;
    }

    static getIdFromCurrentUrl() {

        let url = new URL(window.location);
        let manifestUri = url.searchParams.get('manifest');

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

