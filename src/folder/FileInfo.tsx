import * as React from 'react';
import * as DOMPurify from 'dompurify';
import Cache from '../lib/Cache';
import IManifestData from '../interface/IManifestData';
import Config from '../lib/Config';
import {Translation} from 'react-i18next';
import './manifestations-modal.css';
import './file-info.css';
import FileIcon from '@material-ui/icons/DescriptionOutlined';
import Share from "./Share";
import {getLocalized, addBlankTarget} from "../lib/ManifestHelpers";

interface IHTMLAnchorElement {
    nodeName: string;
    target?: string;
}

interface IProps {
    currentManifest: IManifestData;
}

declare let global: {
    config: Config;
};

class FileInfo extends React.Component<IProps, {}> {

    constructor(props: any) {

        super(props);

        this.showManifestationsModal = this.showManifestationsModal.bind(this);
    }

    render() {
        if (this.props.currentManifest.restricted) {
            return '';
        }

        const manifestData = this.props.currentManifest;
        const metadataView = [];

        // Add a hook to make all links open a new window
        DOMPurify.addHook('afterSanitizeAttributes', (node: any) => {
            // set all elements owning target to target=_blank
            if ('target' in node) {
                node.setAttribute('target', '_blank');
                // prevent https://www.owasp.org/index.php/Reverse_Tabnabbing
                node.setAttribute('rel', 'noopener noreferrer');
            }
        });

        if (manifestData.description.length > 0) {
            metadataView.push(<div key="description">
                <div className="aiiif-label">
                    <Translation ns="common">{(t, { i18n }) => <>{t('description')}</>}</Translation>
                </div>
                <div className="aiiif-value" dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                    __html: DOMPurify.sanitize(getLocalized(manifestData.description), global.config.getSanitizeRulesSet())
                }} />
            </div>);
        }

        if (manifestData.metadata.length > 0) {
            let key = 0;
            for (const metadataItem of manifestData.metadata) {
                const label = getLocalized(metadataItem.label);
                let value = getLocalized(metadataItem.value);
                value = addBlankTarget(value);
                metadataView.push(
                    <div key={key++}>
                        <div className="aiiif-label">{label}</div>
                        <div className="aiiif-value"dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                                __html: DOMPurify.sanitize(value, global.config.getSanitizeRulesSet())
                            }} />
                    </div>
                );
            }
        }

        if (manifestData.attribution && manifestData.attribution.value.length > 0) {
            metadataView.push(<div key="attribution">
                <div className="aiiif-label">
                    <Translation ns="common">{(t, { i18n }) => <p>{t('attribution')}</p>}</Translation>
                </div>
                <div className="aiiif-value" dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                    __html: DOMPurify.sanitize(getLocalized(manifestData.attribution.value), global.config.getSanitizeRulesSet())
                }} />
            </div>);
        }

        if (manifestData.license) {
            metadataView.push(<div key="termsOfUsage">
                <div className="aiiif-label">
                    <Translation ns="common">{(t, { i18n }) => <p>{t('license')}</p>}</Translation>
                </div>
                <div className="aiiif-value"><a href={manifestData.license}>{manifestData.license}</a></div>
            </div>);
        }

        const logo = manifestData.logo;
        if (logo) {
            metadataView.push(<img key="providerLogo" className="aiiif-provider-logo" src={logo} alt="Logo" title="Logo"/>);
        }

        if (
            manifestData.manifestations.length > 0 ||
            (manifestData.resource.manifestations && manifestData.resource.manifestations.length > 0)
        ) {
            metadataView.push(
                <div key="manifestation">
                    <div className="aiiif-show-manifestation" onClick={this.showManifestationsModal}>
                        <Translation ns="common">{(t, { i18n }) => <p>{t('showFile')}</p>}</Translation>
                    </div>
                </div>
            );
        }

        return (
            <div className="aiiif-file-info">
                <Share currentManifest={this.props.currentManifest} />
                <div>
                    <h3>{getLocalized(manifestData.label)}</h3>
                    {metadataView}
                </div>
            </div>
        );
    }

    showManifestationsModal() {

        const bodyJsx = [];
        let manifestations = [];
        const rawManifestations = this.props.currentManifest.manifestations;
        const resource = this.props.currentManifest.resource;
        if (rawManifestations.length > 0) {
            manifestations = rawManifestations;
        } else if (this.props.currentManifest.resource.manifestations && resource.manifestations.length > 0) {
            manifestations = resource.manifestations;
        }

        for (const i in manifestations) {
            if (manifestations.hasOwnProperty(i)) {
                const manifestation = manifestations[i];
                bodyJsx.push(
                    <div key={i} className="aiiif-file-manifestation" onClick={() => this.openFile(manifestation.url)}>
                        <FileIcon />
                        {getLocalized(manifestation.label)}
                    </div>
                );
            }
        }

        const alertArgs = {
            titleJsx: <Translation ns="common">{(t, { i18n }) => <p>{t('fileManifestations')}</p>}</Translation>,
            bodyJsx
        };
        Cache.ee.emit('alert', alertArgs);
    }

    openFile(url: string) {
        const win = window.open(url, '_target');
        if (win) {
            win.focus();
        }
    }
}

export default FileInfo;
