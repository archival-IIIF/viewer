import * as React from 'react';
import ReactOpenSeadragon from './ReactOpenSeadragon';
import MediaPlayer from './MediaPlayer';
import Cache from './lib/Cache';
import videojs from 'video.js';
import IManifestData from './interface/IManifestData';
import PlainTextViewer from './PlainTextViewer';

require('./css/viewer.css');

interface IState {
    data: IManifestData | null;
}


class Viewer extends React.Component<any, IState> {

    private type = '';

    constructor(props: any) {

        super(props);

        this.state = {
            data: null,
        };

        this.open = this.open.bind(this); // click
    }

    render() {

        const manifestData: any = this.state.data;

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
        if (this.state.data) {
            const resource: any = this.state.data.resource;
            return (
                <div id="viewer">
                    <ReactOpenSeadragon source={resource.source} key={resource.source} />
                </div>
            );
        }

    }

    renderPlainText() {
        if (this.state.data) {
            const resource: any = this.state.data.resource;
            return (
                <div id="viewer">
                    <PlainTextViewer source={resource.source} key={resource.source}/>
                </div>
            );
        }
    }

    renderAudioVideo() {

        if (this.state.data) {
            const resource: any = this.state.data.resource;
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

    open(manifestData: any) {
        this.setState({data: manifestData});
    }

    componentDidMount() {
        Cache.ee.addListener('update-file-info', this.open);
    }

    componentWillUnmount() {
        Cache.ee.removeListener('update-file-info', this.open);
    }
}

export default Viewer;
