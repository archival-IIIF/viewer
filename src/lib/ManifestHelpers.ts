import i18n  from 'i18next';
import {LanguageMap} from "manifesto.js";

export function getLocalized(input?: LanguageMap | string) {
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
