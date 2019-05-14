import * as React from 'react';
const iifLogo = require('./icons/iiif.png');
import ManifestationsModal from './ManifestationsModal';
import Interweave from 'interweave';
import {translate, Trans} from 'react-i18next';
import Cache from './lib/Cache';
require('./css/file-info.css');

interface IHTMLAnchorElement {
    nodeName: string;
    target?: string;
}



class FileInfo extends React.Component<{}, any> {

    constructor(props) {

        super(props);

        this.hideManifestationsModal = this.hideManifestationsModal.bind(this);

        this.state = {
            data: null,
            showManifestationsModal: false
        };

        this.updateFileInfo = this.updateFileInfo.bind(this);
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
                            <Interweave
                                tagName="div"
                                content={metadataItem.value}
                            />
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
                    <div id="show-manifestation" onClick={() => this.showManifestationsModal()}>
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
                <ManifestationsModal visible={this.state.showManifestationsModal}
                                     manifestations={manifestData.manifestations}
                                     closeHandler={this.hideManifestationsModal}/>
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
        this.setState({
            showManifestationsModal: true
        });
    }

    hideManifestationsModal() {
        this.setState({
            showManifestationsModal: false
        });
    }

    isURL(str) {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return pattern.test(str);
    }
}

export default translate('common')(FileInfo);
