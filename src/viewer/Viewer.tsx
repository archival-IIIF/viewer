import * as React from 'react';
import ReactOpenSeadragon from './image/ReactOpenSeadragon';
import MediaPlayer from './media/MediaPlayer';
import IManifestData from '../interface/IManifestData';
import PlainTextViewer from './plainText/PlainTextViewer';
import './viewer.css';
import PdfViewer from "./pdf/pdfViewer";

interface IProps {
    currentManifest: IManifestData;
    authDate: number;
}


class Viewer extends React.Component<IProps, {}> {

    private id = Math.random();

    render() {

        const manifestData: any = this.props.currentManifest;

        if (!manifestData || !manifestData.hasOwnProperty('resource')) {
            return '';
        }

        if (manifestData.resource.type === 'imageService') {
            return this.renderImage();
        }

        if (manifestData.resource.type === 'audio' || manifestData.resource.type === 'video') {
            return this.renderAudioVideo();
        }

        if (manifestData.resource.type === 'plainText') {
            return this.renderPlainText();
        }

        if (manifestData.resource.type === 'pdf') {
            return <PdfViewer presentation={manifestData} />;
        }

        return <></>;
    }

    renderImage() {
        const resource: any = this.props.currentManifest.resource;
        return (
            <div className="aiiif-viewer">
                <ReactOpenSeadragon
                    source={resource.source}
                    key={resource.source + this.props.authDate.toString()}
                    authDate={this.props.authDate}
                />
            </div>
        );
    }

    renderPlainText() {
        const resource: any = this.props.currentManifest.resource;
        return (
            <div className="aiiif-viewer">
                <PlainTextViewer source={resource.id} key={resource.id}/>
            </div>
        );
    }

    renderAudioVideo() {

        if (this.props.currentManifest.resource) {
            const resource: any = this.props.currentManifest.resource;

            return (
                <div className="aiiif-viewer">
                    <MediaPlayer key={resource.id} currentManifest={this.props.currentManifest}/>
                </div>
            );
        }
    }
}

export default Viewer;
