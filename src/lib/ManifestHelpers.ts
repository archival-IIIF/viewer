import i18n  from 'i18next';
import {PropertyValue} from "manifesto.js";
import IManifestData from "../interface/IManifestData";

export function getLocalized(input?: PropertyValue | PropertyValue[] | null): string {
    if (!input) {
        return '';
    }

    if (!Array.isArray(input)) {
        input = [input];
    }

    for (const i of input) {
        for (const [key, value] of Object.entries(i)) {
            if (key === i18n.language) {
                return value.toString();
            }
        }

        for (const [key, value] of Object.entries(i)) {
            if (key.substr(0, 2) === i18n.language.substr(0, 2)) {
                return value.toString();
            }
        }
    }

    return Object.values(input[0])[0];
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

export function isSingleRoot(manifestData: IManifestData): boolean {
    return (manifestData.type === 'Collection' && !manifestData.parentId && manifestData.collections.length === 0);
}


export function hasTranscription(manifestData: IManifestData): boolean {
    return manifestData.transcription.length > 0;
}

export function basename(str: string): string {
    return str.substr(str.lastIndexOf('/') + 1);
}

// See: https://iiif.io/api/presentation/2.1/#html-markup-in-property-values
export const sanitizeRulesSet = {
    ALLOWED_ATTR: ['href', 'src', 'alt'],
    ALLOWED_TAGS: ['a', 'b', 'br', 'i', 'img', 'p', 'span'],
};
