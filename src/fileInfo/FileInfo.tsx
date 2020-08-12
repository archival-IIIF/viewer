import * as React from 'react';
import IManifestData from '../interface/IManifestData';
import './file-info.css';
import Share from "./Share";
import {isSingleManifest} from "../lib/ManifestHelpers";
import Metadata from "./Metadata";

interface IProps {
    currentManifest: IManifestData;
}

class FileInfo extends React.Component<IProps, {}> {

    render() {
        if (this.props.currentManifest.restricted) {
            return '';
        }

        if (isSingleManifest(this.props.currentManifest)) {
            return (
                <div className="aiiif-file-info">
                    <div className="aiiif-box">
                        <Metadata currentManifest={this.props.currentManifest} />
                        <Share currentManifest={this.props.currentManifest} />
                    </div>
                </div>
            );
        }

        return (
            <div className="aiiif-file-info">
                <nav className="aiiif-bar">
                    <Share currentManifest={this.props.currentManifest} />
                </nav>
                <Metadata currentManifest={this.props.currentManifest} />
            </div>
        );
    }
}

export default FileInfo;
