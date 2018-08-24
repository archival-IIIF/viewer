class InfoJson {

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
        if (global.token !== "") {
            headers.Authorization = 'Bearer ' + global.token;
        }

        fetch(url, {
                headers: headers
            }
        ).then((response) => {

            if (response.status !== 401) {
                t.cache[url] = response.url;
                if (callback !== undefined) {
                    callback(response.url);
                }

                return;
            }

            return response.json();
        }).then((json) => {
            if (json !== undefined) {
                global.ee.emitEvent('show-login', [json.service]);
            }
        });
    }

    static fetchFromCache(url) {

        if (this.cache.hasOwnProperty(url)) {
            return this.cache[url];
        }

        return false;
    }

    static clearCache() {
        this.cache = {};
    }
}

export default InfoJson;

