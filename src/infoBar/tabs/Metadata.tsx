import React, {useContext} from "react";
import DOMPurify from 'dompurify';
import {addBlankTarget, getLocalized, sanitizeRulesSet} from "../../lib/ManifestHelpers";
import UrlValidation from "../../lib/UrlValidation";
import {Translation} from "react-i18next";
import {AppContext} from "../../AppContext";
import i18n from "i18next";

interface IProps {
    showLicense?: boolean;
    showLogo?: boolean;
}

export default function Metadata(props: IProps) {

    const {currentManifest} = useContext(AppContext);
    if (!currentManifest) {
        return <></>;
    }

    // Add a hook to make all links open a new window
    DOMPurify.addHook('afterSanitizeAttributes', (node: any) => {
        // set all elements owning target to target=_blank
        if ('target' in node) {
            node.setAttribute('target', '_blank');
            // prevent https://www.owasp.org/index.php/Reverse_Tabnabbing
            node.setAttribute('rel', 'noopener noreferrer');
        }
    });

    const metadataView: JSX.Element[] = [];


    if (currentManifest.description.length > 0) {
        metadataView.push(<div key="description">
            <div className="aiiif-label">
                <Translation ns="common">{(t, { i18n }) => <>{t('description')}</>}</Translation>
            </div>
            <div className="aiiif-value" dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                __html: DOMPurify.sanitize(getLocalized(currentManifest.description), sanitizeRulesSet)
            }} />
        </div>);
    }

    if (currentManifest.metadata.length > 0) {
        let key = 0;
        for (const metadataItem of currentManifest.metadata) {
            const label = getLocalized(metadataItem.label);
            let value = getLocalized(metadataItem.value);

            if (UrlValidation.isURL(value)) {
                metadataView.push(
                    <div key={key++} className="aiiif-metadata-item">
                        <strong className="aiiif-label">{label}</strong>
                        <div className="aiiif-value">
                            <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
                        </div>
                    </div>
                );
                continue;
            }

            value = addBlankTarget(value);
            metadataView.push(
                <div key={key++} className="aiiif-metadata-item">
                    <strong>{label}</strong>
                    <div className="aiiif-value" dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                        __html: DOMPurify.sanitize(value, sanitizeRulesSet)
                    }} />
                </div>
            );
        }
    }

    if (props.showLicense !== false && currentManifest.license) {
        metadataView.push(<div key="termsOfUsage">
            <div className="aiiif-label">
                <Translation ns="common">{(t, { i18n }) => <p>{t('license')}</p>}</Translation>
            </div>
            <div className="aiiif-value"><a href={currentManifest.license}>{currentManifest.license}</a></div>
        </div>);
    }

    if (currentManifest.attribution && currentManifest.attribution.value && currentManifest.attribution.value.length > 0) {
        metadataView.push(<div key="attribution">
            <div className="aiiif-label">
                <Translation ns="common">{(t, { i18n }) => <p>{t('attribution')}</p>}</Translation>
            </div>
            <div className="aiiif-value" dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                __html: DOMPurify.sanitize(getLocalized(currentManifest.attribution.value), sanitizeRulesSet)
            }} />
        </div>);
    }

    const logo = currentManifest.logo;
    if (props.showLogo !== false && logo) {
        metadataView.push(<img key="providerLogo" className="aiiif-provider-logo" src={logo} alt="Logo" title="Logo"/>);
    }

    for (const homepage of languageFilter(currentManifest.homepages)) {
        metadataView.push(
            <a key={Math.random()} href={homepage.id} className="aiiif-download" target="_blank"
               rel="noopener noreferrer">{getLocalized(homepage.label)}
            </a>
        );
    }


    return <>{metadataView}</>;
}

export function languageFilter(data: any[] | undefined): any[] {

    if (!data) {
        return [];
    }

    if (data.length === 1) {
        return data;
    }


    let filtered = data.filter(h => {
        for (const l of h.label) {
            if (l._locale === i18n.language) {
                return true;
            }
        }
        return false;
    });
    if (filtered.length > 0) {
        return filtered;
    }

    filtered = data.filter(
        h => {
            for (const l of h.label) {
                if (l._locale && l._locale.slice(0, 2) === i18n.language.slice(0, 2)) {
                    return true;
                }
            }
            return false;
        }
    );
    if (filtered.length > 0) {
        return filtered;
    }

    return data;
}
