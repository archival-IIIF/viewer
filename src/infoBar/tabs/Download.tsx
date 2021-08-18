import React, {useContext} from "react";
import {basename, getLocalized} from "../../lib/ManifestHelpers";
import i18next from "i18next";
import "./download.css"
import {AppContext} from "../../AppContext";

export default function Download() {

    const {currentManifest, page} = useContext(AppContext);
    if (!currentManifest) {
        return <></>;
    }

    const output: JSX.Element[] = [];

    if (currentManifest.images[page]) {
        const image = currentManifest.images[page];
        let extension = 'jpg';
        if (image.format === 'image/tiff') {
            extension = 'tif';
        } else if (image.format === 'image/png') {
            extension = 'png';
        } else if (image.format === 'image/webp') {
            extension = 'webp';
        } else if (image.format === 'image/gif') {
            extension = 'gif';
        }
        output.push(
            <div className="aiiif-download" key="elementDownload1">
                <a href={image.id + '/full/max/0/default.' + extension}
                   download={basename(image.id)}>{i18next.t('common:image')} (
                    {extension.toUpperCase()} {image.width}x{image.height})</a>
            </div>
        );
        if (image.width > 1000 || image.height > 1000) {
            const smallWidth = image.width < 1000 ? image.width : 1000;
            const smallHeight = image.width < 1000  ? image.height : Math.round(image.height / image.width * 1000);
            output.push(
                <div className="aiiif-download" key="elementDownload2">
                    <a href={image.id + '/full/'+smallWidth+','+smallHeight+'/0/default.jpg'}
                       download={basename(image.id)+'.jpg'}>{i18next.t('common:image')} (JPG
                        {smallWidth}x{smallHeight})</a>
                </div>
            );
        }
    }

    let manifestations = [];
    const rawManifestations = currentManifest.manifestations;
    const resource = currentManifest.resource;
    if (rawManifestations.length > 0) {
        manifestations = rawManifestations;
    } else if (resource && resource.manifestations) {
        manifestations = resource.manifestations;
    }

    for (const i in manifestations) {
        if (manifestations.hasOwnProperty(i)) {
            const manifestation = manifestations[i];
            output.push(
                <a key={i} href={manifestation.url} className="aiiif-download" target="_blank"
                   rel="noopener noreferrer">
                    {getLocalized(manifestation.label)}
                </a>
            );
        }
    }

    if (currentManifest.seeAlso) {
        for (const i of currentManifest.seeAlso) {
            output.push(
                <a key={i.id} href={i.id} className="aiiif-download" target="_blank"  rel="noopener noreferrer">
                    {getLocalized(i.label)}
                </a>
            );
        }
    }

    return <>{output}</>;
}
