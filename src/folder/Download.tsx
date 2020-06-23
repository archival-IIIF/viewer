import * as React from 'react';
import Cache from '../lib/Cache';
import IManifestData from '../interface/IManifestData';
import {Translation} from 'react-i18next';
import FileIcon from '@material-ui/icons/DescriptionOutlined';
import {getLocalized} from "../lib/ManifestHelpers";
import './download.css';

interface IProps {
    currentManifest: IManifestData;
}

export default class Download extends React.Component<IProps, {}> {

    render() {

        const manifestData = this.props.currentManifest;
        if (
            manifestData.manifestations.length > 0 ||
            (manifestData.resource.manifestations && manifestData.resource.manifestations.length > 0)
        ) {
            return <div className="aiiif-show-downloads" onClick={() => this.showManifestationsModal()}>
                    <Translation ns="common">{(t, { i18n }) => <>{t('download')}</>}</Translation>
                </div>
        }

        return <></>;
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
                    <a key={i} href={manifestation.url} className="aiiif-download" target="_blank"
                       rel="noopener noreferrer">
                        <FileIcon />
                        {getLocalized(manifestation.label)}
                    </a>
                );
            }
        }

        const alertArgs = {
            titleJsx: <Translation ns="common">{(t, { i18n }) => <p>{t('download')}</p>}</Translation>,
            bodyJsx
        };
        Cache.ee.emit('alert', alertArgs);
    }
}
