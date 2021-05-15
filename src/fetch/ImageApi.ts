import Cache from '../lib/Cache';
import {IAuthService} from "../interface/IManifestData";
import {ServiceProfile} from "@iiif/vocabulary/dist-commonjs";
import Token from "../lib/Token";
import Manifest from "./PresentationApi";
import Config from "../lib/Config";

declare let global: {
    config: Config;
};

class ImageApi {

    static cache: any = {};

    static get(id: string): Promise<any> {

        return new Promise((resolve, reject) => {

            const data = this.fetchFromCache(id);
            if (data !== false) {
                resolve(data)
                return;
            }

            this.fetchFromUrl(id).then(d => resolve(d)).catch(r => reject(r));
        })
    }

    static fetchFromUrl(url: string, token?: string) {

        return new Promise((resolve, reject) => {
            if (!global.config.isAllowedOrigin(url)) {
                const alertArgs = {title: 'Error', body: 'The image manifest-Url is not an allowed origin: ' + url};
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

            let id = url;
            if (url.endsWith('/info.json')) {
                id.replace('/info.json', '');
            } else {
                url += '/info.json';
            }

            fetch(url, init).then((response) => {

                const statusCode = response.status;

                if (statusCode !== 401 && statusCode >= 400) {
                    const alertArgs = {
                        title: 'Error',
                        body: 'Could not fetch info.json!\n\n' + url
                    };
                    Cache.ee.emit('alert', alertArgs);
                    return;
                }

                response.json().then((json) => {
                    const authService = this.getAuthService(json);
                    json.statusCode = statusCode;
                    json.authService = authService;


                    if (statusCode === 401 || url !== response.url) {
                        if (token) {
                            const alertArgs = {
                                title: 'Login failed',
                                body: ''
                            };
                            Cache.ee.emit('alert', alertArgs);
                            return;
                        }
                        if (!authService) {
                            const alertArgs = {
                                title: 'Login failed',
                                body: 'Auth service is missing!'
                            };
                            Cache.ee.emit('alert', alertArgs);
                            return;
                        }
                        if (!authService.token) {
                            const alertArgs = {
                                title: 'Login failed',
                                body: 'Token service is missing!'
                            };
                            Cache.ee.emit('alert', alertArgs);
                            return;
                        }

                        const newToken = authService.token;
                        if (Token.has(newToken)) {
                            this.fetchFromUrl(url, Token.get(newToken)).then(d => resolve(d)).catch(r => reject(r));
                            return;
                        }

                        if (authService.profile === ServiceProfile.AUTH_1_EXTERNAL) {
                            Manifest.loginInExternal(authService, url).then((d: any) => resolve(d))
                                .catch(r => reject(r));
                            return;
                        }


                        Cache.ee.emit('show-login', authService);
                    } else {
                        t.cache[id] = json;
                    }

                    resolve(json);
                });
            }).catch((err) => {
                console.log(err);
                const alertArgs = {
                    title: 'Error',
                    body: 'Could not read info.json!\n\n' + url
                };
                Cache.ee.emit('alert', alertArgs);
            });
        });
    }

    static getAuthService(json: any): IAuthService | undefined {

        if (!json.service) {
            return undefined;
        }
        let authService;
        if (Array.isArray(json.service)) {
            authService = json.service[0];
        } else {
            authService = json.service;
        }

        if (!authService.id && !authService["@id"]) {
            return undefined;
        }

        const serviceProfiles = [
            ServiceProfile.AUTH_1_EXTERNAL,
            ServiceProfile.AUTH_1_KIOSK,
            ServiceProfile.AUTH_1_CLICK_THROUGH,
            ServiceProfile.AUTH_1_LOGIN
        ]

        let profile = '';
        let id = authService.id ?? authService["@id"];
        for (const serviceProfile of serviceProfiles) {
            if (id === serviceProfile) {
                profile = serviceProfile;
                break;
            }
        }

        let token;
        let logout;
        if (authService.service) {
            for (const service of authService.service) {
                if (service.profile === ServiceProfile.AUTH_1_TOKEN) {
                    token = service.id ?? service["@id"];
                } else if (service.profile === ServiceProfile.AUTH_1_LOGOUT) {
                    logout = service.id ?? service["@id"];
                }
            }
        }


        return {
            token,
            logout,
            confirmLabel: authService.confirmLabel,
            description: authService.description,
            errorMessage: authService.failureDescription,
            header: authService.header,
            failureHeader: authService.failureHeader,
            profile,
            id
        };
    }


    static fetchFromCache(id: string) {

        if (this.cache.hasOwnProperty(id)) {
            return this.cache[id];
        }

        return false;
    }

    static clearCache() {
        this.cache = {};
    }
}

export default ImageApi;
