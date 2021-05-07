import i18n  from 'i18next';
import {PropertyValue} from "manifesto.js";
import IManifestData from "../interface/IManifestData";

export function getLocalized(input?: PropertyValue | string | null) {
    if (!input || input.length === 0) {
        return '';
    }

    if (typeof input === 'string') {
        return input;
    }

    for (const item of input) {
        if (item.locale === i18n.language) {
            return item.value;
        }
    }

    for (const item of input) {
        if (item.locale.substr(0, 2) === i18n.language.substr(0, 2)) {
            return item.value;
        }
    }

    return input[0].value;
}

export function addBlankTarget(input: string) {
    const tmp: HTMLDivElement = document.createElement('div');
    tmp.innerHTML = input;
    for (let i: number = 0; i < tmp.children.length; i++) {
        let child: Element | null = tmp.children.item(i);
        if (child) {
            if (child.nodeName === 'A') {
                child.setAttribute('target', '_blank');
                child.setAttribute('rel', 'noopener');
            }
        }
    }
    return tmp.innerHTML;
}

export function isSingleManifest(manifestData: IManifestData): boolean {
    if (manifestData.type !== 'Manifest') {
        return false;
    }

    if (manifestData.parentId) {
        return false;
    }

    return true;
}

export function hasTranscription(manifestData: IManifestData): boolean {
    return manifestData.transcription.length > 0;
}

// See: https://iiif.io/api/presentation/2.1/#html-markup-in-property-values
export const sanitizeRulesSet = {
    ALLOWED_ATTR: ['href', 'src', 'alt'],
    ALLOWED_TAGS: ['a', 'b', 'br', 'i', 'img', 'p', 'span'],
};
