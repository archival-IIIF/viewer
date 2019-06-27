import * as React from 'react';
const iifLogo = require('./icons/iiif.png');
require('./css/manifestations-modal.css');
import * as DOMPurify from 'dompurify';
import {translate, Trans} from 'react-i18next';
import Cache from './lib/Cache';
import IManifestData from './interface/IManifestData';
import Config from './lib/Config';
require('./css/file-info.css');

interface IHTMLAnchorElement {
    nodeName: string;
    target?: string;
}

interface IState {
    data: IManifestData;
}

declare let global: {
    config: Config;
};

class FileInfo extends React.Component<{}, IState> {

    constructor(props) {

        super(props);

        this.state = {
            data: null,
        };

        this.updateFileInfo = this.updateFileInfo.bind(this);
        this.showManifestationsModal = this.showManifestationsModal.bind(this);
    }

    render() {
        if (this.state.data === null || this.state.data === undefined || this.state.data.restricted) {
            return '';
        }

        if (typeof this.state.data === 'string') {
            return <div id="file-info">{this.state.data}</div>;
        }

        const manifestData = this.state.data;
        const metadataView = [];

        if (manifestData.description !== undefined) {
            metadataView.push(<div key="description">
                <div className="label"><Trans i18nKey="description"/></div>
                <div className="value">{manifestData.description}</div>
            </div>);
        }

        if (manifestData.metadata !== undefined) {
            for (const key in manifestData.metadata) {
                if (manifestData.metadata.hasOwnProperty(key)) {
                    const metadataItem = manifestData.metadata[key];
                    metadataView.push(<div key={key}>
                        <div className="label">{metadataItem.label}</div>
                        <div className="value">
                            <div  dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                                __html: DOMPurify.sanitize(metadataItem.value, global.config.getSanitizeRulesSet())
                            }} />
                        </div>
                    </div>);
                }
            }
        }

        if (manifestData.attribution) {
            metadataView.push(<div key="attribution">
                <div className="label"><Trans i18nKey="attribution"/></div>
                <div className="value">{manifestData.attribution}</div>
            </div>);
        }

        if (manifestData.license !== undefined) {
            metadataView.push(<div key="termsOfUsage">
                <div className="label"><Trans i18nKey="license"/></div>
                <div className="value"><a href={manifestData.license}>{manifestData.license}</a></div>
            </div>);
        }

        const logo = manifestData.logo;
        if (logo) {
            metadataView.push(<img key="providerLogo" id="provider-logo" src={logo} alt="Logo" title="Logo"/>);
        }

        if (manifestData.manifestations.length > 0) {
            metadataView.push(
                <div key="manifestation">
                    <div id="show-manifestation" onClick={this.showManifestationsModal}>
                        <Trans i18nKey="showFile"/>
                    </div>
                </div>
            );
        }

        return (
            <div id="file-info">
                <h3>{manifestData.label}</h3>
                {metadataView}
                <a id="iiif-logo" href={manifestData.id} target="_blank">
                    <img src={iifLogo} title="IIIF-Manifest" alt="IIIF-Manifest"/>
                </a>
            </div>
        );
    }

    componentDidMount() {
        Cache.ee.addListener('update-file-info', this.updateFileInfo);
    }


    componentWillUnmount() {
        Cache.ee.removeListener('update-file-info', this.updateFileInfo);
    }

    addBlankTarget(input) {
        const tmp = document.createElement('div');
        tmp.innerHTML = input;
        for (let i = 0; i < tmp.children.length; i++) {
            const node: IHTMLAnchorElement = tmp.children[i];
            if (node.nodeName === 'A') {
                node.target = '_blank';
            }
        }
        return tmp.innerHTML;
    }

    updateFileInfo(data) {
        this.setState({data});
    }

    showManifestationsModal() {

        const manifestations = this.state.data.manifestations;
        const bodyJsx = [];
        for (const i in manifestations) {
            if (manifestations.hasOwnProperty(i)) {
                const manifestation = manifestations[i];
                bodyJsx.push(
                    <div key={i} className="file-manifestation" onClick={() => this.openFile(manifestation.url)}>
                        {manifestation.label}
                    </div>
                );
            }
        }

        const alertArgs = {
            titleJsx: <Trans i18nKey="fileManifestations" />,
            bodyJsx
        };
        Cache.ee.emit('alert', alertArgs);
    }

    openFile(url) {
        const win = window.open(url, '_target');
        win.focus();
    }
}

export default translate('common')(FileInfo);
