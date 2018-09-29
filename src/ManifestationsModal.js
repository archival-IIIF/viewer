import Modal from './Modal';
import React from 'react';
import { translate, Trans} from 'react-i18next';
import './css/manifestations-modal.css';

class ManifestationsModal extends Modal {

    constructor(props) {

        super(props);

        this.closeModal = props.closeHandler;

        this.state = {
            id: 'file-manifestations',
            title: <Trans i18nKey="fileManifestations" />,
            visible: props.visible,
            manifestations: props.manifestations
        };
    }

    body() {
        let body = [];
        for (let i in this.state.manifestations) {
            let manifestation = this.state.manifestations[i];
            body.push(
                <div key={i} className="file-manifestation"  onClick={() => this.openFile(manifestation.url)}>
                    {manifestation.label}
                </div>
            )
        }

        return <div>{body}</div>
    }

    openFile(url) {
        let win = window.open(url, '_target');
        win.focus();
    }
}

export default translate('common')(ManifestationsModal);
