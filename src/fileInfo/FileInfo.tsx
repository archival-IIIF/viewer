import * as React from 'react';
import IManifestData from '../interface/IManifestData';
import './file-info.css';
import Share from "./Share";
import {isSingleManifest} from "../lib/ManifestHelpers";
import Metadata from "./Metadata";

interface IProps {
    currentManifest: IManifestData;
}

export default function FileInfo(props: IProps) {

    if (props.currentManifest.restricted) {
        return <></>;
    }

    if (isSingleManifest(props.currentManifest)) {
        return (
            <div className="aiiif-file-info">
                <div className="aiiif-box">
                    <Metadata currentManifest={props.currentManifest} />
                    <Share currentManifest={props.currentManifest} />
                </div>
            </div>
        );
    }

    return (
        <div className="aiiif-file-info">
            <nav className="aiiif-bar">
                <Share currentManifest={props.currentManifest} />
            </nav>
            <Metadata currentManifest={props.currentManifest} />
        </div>
    );
}

