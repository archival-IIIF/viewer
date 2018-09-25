class InfoJson {

    static cache = {};

    static get(id, callback) {

        let data = this.fetchFromCache(id);
        if (data !== false) {
            if (callback !== undefined) {
                callback(data);
            }

            return;
        }

        this.fetchFromUrl(id, callback)

    }

    static fetchFromUrl(id, callback) {

        let t = this;
        let headers = {};
        if (global.token !== '') {
            headers.Authorization = 'Bearer ' + global.token;
        }

        let url = id + '/info.json';
        fetch(url, {
                headers: headers
            }
        ).then((response) => {

            let statusCode = response.status;

            if (statusCode !== 401 && statusCode >= 400) {
                alert('Could not fetch manifest!\n' + url);
                return;
            }

            response.json().then((json) => {

                t.cache[id] = json;

                if (callback !== undefined) {
                    callback(json);
                }

            });
        }).catch(err => {
            console.log(err);
            alert('Could not read manifest!\n' + url);
        });
    }

    static fetchFromCache(id) {

        if (this.cache.hasOwnProperty(id)) {
            return this.cache[id];
        }

        return false;
    }

    static clearCache() {
        this.cache = {};
    }
}

export default InfoJson;

