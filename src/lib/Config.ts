import TouchDetection from './TouchDetection';
import IConfigParameter from '../interface/IConfigParameter';

class Config {

    private readonly defaultNavBarWidth: number = 300;

    private minimalNavBarWidth: number = 120;

    private readonly language: string;

    private readonly fallbackLanguage: string = 'en';

    private readonly translations: object = {
        en: 'English',
        de: 'Deutsch'
    };

    // See: https://iiif.io/api/presentation/2.1/#html-markup-in-property-values
    private sanitizeRulesSet = {
        ALLOWED_ATTR: ['href', 'src', 'alt'],
        ALLOWED_TAGS: ['a', 'b', 'br', 'i', 'img', 'p', 'span'],
    };

    constructor(config: IConfigParameter) {
        this.language = config.language ? config.language : window.navigator.language;
    }

    getSplitterWidth(folded: boolean) {

        if (TouchDetection.isTouchDevice()) {
            if (folded === true) {
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

    getSanitizeRulesSet() {
        return this.sanitizeRulesSet;
    }

    getLanguage() {
        return this.language;
    }

    getFallbackLanguage() {
        return this.fallbackLanguage;
    }

    getTranslations() {
        return this.translations;
    }
}

export default Config;
