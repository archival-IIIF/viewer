import Modal from './Modal';
import * as React from 'react';
import { translate, Trans} from 'react-i18next';
require('./css/manifestations-modal.css');

class ManifestationsModal extends Modal {

    constructor(props) {

        super(props);

        this.closeModal = props.closeHandler;

        this.state = {
            id: 'file-manifestations',
            manifestations: props.manifestations,
            title: <Trans i18nKey="fileManifestations" />,
            visible: props.visible
        };
    }

    body() {
        const body = [];
        for (const i in this.state.manifestations) {
            if (this.state.manifestations.hasOwnProperty(i)) {
                const manifestation = this.state.manifestations[i];
                body.push(
                    <div key={i} className="file-manifestation"  onClick={() => this.openFile(manifestation.url)}>
                        {manifestation.label}
                    </div>
                );
            }
        }

        return [<div key={1}>{body}</div>];
    }

    openFile(url) {
        const win = window.open(url, '_target');
        win.focus();
    }
}

export default translate('common')(ManifestationsModal);
