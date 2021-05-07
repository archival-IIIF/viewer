import TouchDetection from './TouchDetection';
import IConfigParameter from '../interface/IConfigParameter';

class Config {

    private readonly defaultNavBarWidth: number = 300;

    private minimalNavBarWidth: number = 120;

    private readonly language: string;

    private readonly disableSharing: boolean;

    private readonly disableLanguageSelection: boolean;

    private readonly externalSearchUrl?: string;

    private readonly manifest: string;

    private readonly fallbackLanguage: string = 'en';

    private readonly allowedOrigins: string | string[] = '*';

    private readonly translations: object = {
        en: 'English',
        de: 'Deutsch',
        fr: 'Français',
        it: 'Italiano',
        nl: 'Nederlands'
    };

    constructor(config: IConfigParameter) {
        this.language = config.language ? config.language : window.navigator.language;
        this.manifest = config.manifest ? config.manifest : '';
        this.allowedOrigins = config.allowedOrigins ? config.allowedOrigins : '*';
        this.disableSharing = config.disableSharing ? config.disableSharing : false;
        this.disableLanguageSelection = config.disableLanguageSelection ? config.disableLanguageSelection : false;
        this.externalSearchUrl = config.externalSearchUrl;
    }

    getSplitterWidth(folded: boolean) {

        if (TouchDetection.isTouchDevice()) {
            if (folded) {
                return 0;
            }

            return 16;
        }

        return 8;
    }

    getDefaultNavBarWith() {
        return this.defaultNavBarWidth;
    }

    getMinimalNavBarWidth() {
        return this.minimalNavBarWidth;
    }

    getLanguage() {

        if (Object.keys(this.translations).includes(this.language)) {
            return this.language;
        }

        if (Object.keys(this.translations).includes(this.language.substr(0, 2))) {
            return this.language.substr(0, 2)
        }

        return this.fallbackLanguage;
    }

    getFallbackLanguage() {
        return this.fallbackLanguage;
    }

    getTranslations() {
        return this.translations;
    }

    getManifest() {
        return this.manifest;
    }

    getDisableSharing() {
        return this.disableSharing;
    }

    getDisableLanguageSelection() {
        return this.disableLanguageSelection;
    }

    getExternalSearchUrl() {
        return this.externalSearchUrl;
    }

    isAllowedOrigin(url: string): boolean {
        if (this.allowedOrigins === '*') {
            return true;
        }

        if (!Array.isArray(this.allowedOrigins)) {
            return url.startsWith(this.allowedOrigins);
        }

        for (const allowedOrigin of this.allowedOrigins) {
            if (url.startsWith(allowedOrigin)) {
                return true;
            }
        }

        return false;
    }
}

export default Config;
