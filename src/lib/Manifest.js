import Config from "../config/config";

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

        let request = new XMLHttpRequest();
        request.onload = function() {
            let data;

            try {
                data = JSON.parse(this.responseText);
            } catch(e) {
                let error = "The manifest is not a valid json-file: \n"+url;
                data = error;
            }

            t.cache[url] = data;

            if (callback !== undefined) {
                callback(data);
            }
        };
        request.onerror = function() {
            let error = "Could not fetch manifest url: \n"+url;
            t.cache[url] = error;
            if (callback !== undefined) {
                callback(error);
            }

        };
        request.open("get", url, true);
        request.send();
    }

    static fetchFromCache(url) {

        if (this.cache.hasOwnProperty(url)) {
            return this.cache[url];
        }

        return false;
    }

    static getIdFromCurrentUrl() {
        let shortId = window.location.pathname.substr(1);
        if (shortId === "") {
            return false;
        }
        return Config.manifestPrefix+shortId;
    }

    static getShortId(id) {
        return id.substring(id.lastIndexOf('/') + 1);
    }
}

export default Manifest;

