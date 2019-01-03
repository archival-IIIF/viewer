import * as React from 'react';
require('./css/viewer.css');
import OpenSeadragon from './OpenSeadragon';
import MediaPlayer from './MediaPlayer';
import Cache from './lib/Cache';
import videojs from 'video.js';

class Viewer extends React.Component<{}, any> {

    private type = '';

    constructor(props) {

        super(props);

        this.state = {
            data: null,
        };

        this.open = this.open.bind(this); // click
        this.play = this.play.bind(this); // doubleClick
    }

    render() {

        Cache.viewerHeight = 0;
        const manifestData = this.state.data;

        if (!manifestData || !manifestData.hasOwnProperty('resource')) {
            return '';
        }

        if (manifestData.resource.type === 'imageService') {
            Cache.viewerHeight = 349;
            return this.renderImage();
        }

        if (manifestData.resource.type === 'audioVideo') {
            Cache.viewerHeight = 349;
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
            <div id="viewer" style={{left: this.state.left}}>
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

    play(data) {

        if (this['type'] === 'audioVideo') {
            // ToDo
            // document.getElementById('player1_html5').play();
        }
    }

    componentDidMount() {
        Cache.ee.addListener('update-file-info', this.open);
        Cache.ee.addListener('play-audio', this.play);
    }

    componentWillUnmount() {
        Cache.ee.removeListener('update-file-info', this.open);
        Cache.ee.removeListener('play-audio', this.play);
    }
}

export default Viewer;
