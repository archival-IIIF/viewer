import * as React from 'react';
require('./css/viewer.css');
import OpenSeadragon from './OpenSeadragon';
import MediaPlayer from './MediaPlayer';
import Cache from './lib/Cache';
import videojs from 'video.js';
import IManifestData from './interface/IManifestData';

interface IState {
    data?: IManifestData;
}


class Viewer extends React.Component<{}, IState> {

    private type = '';

    constructor(props) {

        super(props);

        this.state = {
            data: null,
        };

        this.open = this.open.bind(this); // click
    }

    render() {

        const manifestData = this.state.data;

        if (!manifestData || !manifestData.hasOwnProperty('resource')) {
            return '';
        }

        if (manifestData.resource.type === 'imageService') {
            return this.renderImage();
        }

        if (manifestData.resource.type === 'audioVideo') {
            return this.renderAudioVideo();
        }

        return '';
    }

    renderImage() {
        return (
            <div id="viewer">
                <OpenSeadragon source={this.state.data.resource.source} key={this.state.data.resource.source} />
            </div>
        );
    }

    renderAudioVideo() {

        const element0 = this.state.data.resource.source;
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

    open(manifestData) {
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
