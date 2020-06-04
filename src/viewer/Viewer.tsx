import * as React from 'react';
import ReactOpenSeadragon from './ReactOpenSeadragon';
import MediaPlayer from './MediaPlayer';
import videojs from 'video.js';
import IManifestData from '../interface/IManifestData';
import PlainTextViewer from './PlainTextViewer';
import './viewer.css';

interface IProps {
    data: IManifestData | null;
}


class Viewer extends React.Component<IProps, {}> {

    private type = '';

    render() {

        const manifestData: any = this.props.data;

        if (!manifestData || !manifestData.hasOwnProperty('resource')) {
            return '';
        }

        if (manifestData.resource.type === 'imageService') {
            return this.renderImage();
        }

        if (manifestData.resource.type === 'audioVideo') {
            return this.renderAudioVideo();
        }

        if (manifestData.resource.format === 'text/plain') {
            return this.renderPlainText();
        }

        return '';
    }

    renderImage() {
        if (this.props.data) {
            const resource: any = this.props.data.resource;
            return (
                <div id="viewer">
                    <ReactOpenSeadragon source={resource.source} key={resource.source} />
                </div>
            );
        }

    }

    renderPlainText() {
        if (this.props.data) {
            const resource: any = this.props.data.resource;
            return (
                <div id="viewer">
                    <PlainTextViewer source={resource.source} key={resource.source}/>
                </div>
            );
        }
    }

    renderAudioVideo() {

        if (this.props.data) {
            const resource: any = this.props.data.resource;
            const element0 = resource.source;
            const mime = element0.format;
            const mediaType = mime.substr(0, 5);
            const file = element0['@id'];
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
