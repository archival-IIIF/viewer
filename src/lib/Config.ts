import TouchDetection from './TouchDetection';
import IConfigParameter from '../interface/IConfigParameter';

class Config {

    private readonly defaultNavBarWidth = 300;

    private readonly language: string;

    private readonly fallbackLanguage: string = 'en';

    // Presentation API 2 suggestion.
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
                return 32;
            }

            return 16;
        }

        return 8;
    }

    getDefaultNavBarWith() {
        return this.defaultNavBarWidth;
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
}

export default Config;
