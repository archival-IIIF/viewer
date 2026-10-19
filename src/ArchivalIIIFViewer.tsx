import App from './App';
import type IConfigParameter from './interface/IConfigParameter';
import i18n from 'i18next';
import { createRoot, type Root } from 'react-dom/client';

export default class ArchivalIIIFViewer {

    private root: Root;

    constructor(config: IConfigParameter) {
        const container = document.getElementById(config.id);

        if (!container) {
            throw new Error(
                `ArchivalIIIFViewer: Element with id "${config.id}" not found.`
            );
        }

        this.root = createRoot(container);
        this.root.render(<App config={config} />);
    }

    changeLanguage(code: string): Promise<void> {
        return i18n.changeLanguage(code).then(() => {});
    }

    destroy(): void {
        this.root.unmount();
    }
}