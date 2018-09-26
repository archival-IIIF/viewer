import React from 'react';
import './css/viewer.css';
import OpenSeadragon from './OpenSeadragon';
import MediaElement from './MediaElement';


class Viewer extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            data: null,
        };
    }

    render() {

        global.viewerHeight = 0;
        let manifestData = this.state.data;

        if (!manifestData || !manifestData.hasOwnProperty('resource')) {
            return '';
        }

        if (manifestData.resource.type === 'imageService') {
            global.viewerHeight = 349;
            return this.renderImage();
        }

        if (manifestData.resource.type === 'audioVideo') {
            global.viewerHeight = 349;
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

        let element0 = this.state.data.resource.source;
        let mime = element0.format;
        let mediaType = mime.substr(0, 5);
        let file = element0['@id'];
        let sources = [{src: file, type: mime}];
        let config = {};
        let tracks = {};

        this.type = 'audioVideo';

        return (
            <div id="viewer" style={{left: this.state.left}}>
                <MediaElement
                    id="player1"
                    key={file}
                    mediaType={mediaType}
                    preload="metadata"
                    controls
                    height="360"
                    sources={JSON.stringify(sources)}
                    options={JSON.stringify(config)}
                    tracks={JSON.stringify(tracks)}
                />
            </div>
        );
    }

    open(manifestData) {
        this.setState({data: manifestData});
    }

    play(data) {

        if (this.type === 'audioVideo') {
            document.getElementById('player1_html5').play();

        }
    }

    openListener = this.open.bind(this); // click
    playListener = this.play.bind(this); // doubleClick

    componentDidMount() {
        global.ee.addListener('update-file-info', this.openListener);
        global.ee.addListener('play-audio', this.playListener);
    }

    componentWillUnmount() {
        global.ee.removeListener('update-file-info', this.openListener);
        global.ee.addListener('play-audio', this.playListener);
    }

}

export default Viewer;