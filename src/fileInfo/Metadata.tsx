import * as React from 'react';
import * as DOMPurify from 'dompurify';
import IManifestData from '../interface/IManifestData';
import Config from '../lib/Config';
import {Translation} from 'react-i18next';
import './file-info.css';
import {getLocalized, addBlankTarget} from "../lib/ManifestHelpers";
import Download from "./Download";
import UrlValidation from "../lib/UrlValidation";

interface IProps {
    currentManifest: IManifestData;
}

declare let global: {
    config: Config;
};

export default class Metadata extends React.Component<IProps, {}> {

    render() {

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

                if (UrlValidation.isURL(value)) {
                    metadataView.push(
                        <div key={key++}>
                            <div className="aiiif-label">{label}</div>
                            <div className="aiiif-value">
                                <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
                            </div>
                        </div>
                    );
                    continue;
                }

                value = addBlankTarget(value);
                metadataView.push(
                    <div key={key++}>
                        <div className="aiiif-label">{label}</div>
                        <div className="aiiif-value" dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(value, global.config.getSanitizeRulesSet())
                        }} />
                    </div>
                );
            }
        }

        if (manifestData.attribution && manifestData.attribution.value && manifestData.attribution.value.length > 0) {
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

        metadataView.push(<Download currentManifest={this.props.currentManifest} key="manifestation" />);

        return <div>
            <h3>{getLocalized(manifestData.label)}</h3>
            {metadataView}
        </div>
    }
}

