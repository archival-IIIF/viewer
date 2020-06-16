import * as React from 'react';
import ReactOpenSeadragon from './ReactOpenSeadragon';
import MediaPlayer from './MediaPlayer';
import videojs from 'video.js';
import IManifestData from '../interface/IManifestData';
import PlainTextViewer from './PlainTextViewer';
import './viewer.css';

interface IProps {
    currentManifest: IManifestData;
    authDate: number;
}


class Viewer extends React.Component<IProps, {}> {

    private type = '';

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
            return this.renderPdf();
        }

        return '';
    }

    renderImage() {
        const resource: any = this.props.currentManifest.resource;
        return (
            <div id="viewer">
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
            <div id="viewer">
                <PlainTextViewer source={resource.id} key={resource.id}/>
            </div>
        );
    }

    renderPdf() {

        if (this.props.currentManifest.resource) {
            const id = this.props.currentManifest.resource.id

            return <iframe id="viewer" src={id} title={id}/>;
        }
    }

    renderAudioVideo() {

        if (this.props.currentManifest.resource) {
            const resource: any = this.props.currentManifest.resource;
            const mime = resource.format;
            const mediaType = resource.type;
            const file = resource.id;
            const sources: videojs.Tech.SourceObject[] = [{src: file, type: mime}];

            this.type = 'audioVideo';

            return (
                <div id="viewer">
                    <MediaPlayer
                        id="player1"
                        key={file}
                        mediaType={mediaType}
                        preload="metadata"
                        controls={true}
                        height={360}
                        sources={sources}
                    />
                </div>
            );
        }
    }
}

export default Viewer;
