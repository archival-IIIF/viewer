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
        if (global.token !== "") {
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

                t.cache[url] = json;
                if (callback !== undefined) {
                    callback(json);
                }
            }
        });

    }

    static fetchFromCache(url) {

        if (this.cache.hasOwnProperty(url)) {
            return this.cache[url];
        }

        return false;
    }

    static getIdFromCurrentUrl() {

        let url = new URL(window.location);
        let manifestUri = url.searchParams.get("manifest");

        if (manifestUri === "") {
            return false;
        }
        return manifestUri;
    }
}

export default Manifest;

