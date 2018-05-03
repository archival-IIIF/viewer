import React from "react";
import './css/audio-player.css';
import MediaElement from './MediaElement';
import Nested from "./lib/Nested";

class AudioPlayer extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            file: null,
            mime: null,
            mediaType: null
        };
    }

    render() {

        if (this.state.file === null) {
            return "";
        }

        let sources = [{src: this.state.file, type: this.state.mime}];
        let config = {};
        let tracks = {};

        return (
            <div id="audio-player">
                <MediaElement
                    id="player1"
                    key={this.state.file}
                    mediaType={this.state.mediaType}
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


    playAudio() {
        document.getElementById("player1_html5").play();
    }


    showAudio(data) {

        if ( !Nested.has(data, "mediaSequences", 0, "elements", 0, "rendering", "format")) {
            this.clear();
            return;
        }

        let mime = data.mediaSequences[0].elements[0].rendering["format"];
        let mediaFormat = mime.substr(0, 5);
        if (mediaFormat !== "audio" && mediaFormat !== "video") {
            this.clear();
            return;
        }

        let file = data.mediaSequences[0].elements[0].rendering["@id"];
        if (file === null) {
            this.clear();
            return;
        }

        this.setState({
            file: file,
            mime: mime,
            mediaType: mediaFormat
        });
    }

    updateFileInfo = this.showAudio.bind(this);
    playAudioListener = this.playAudio.bind(this);

    clear() {
        this.setState({
            file: null,
            mime: null,
            mediaType: null
        });
    }

    componentDidMount() {
        global.ee.addListener('update-file-info', this.updateFileInfo);
        global.ee.addListener('play-audio', this.playAudioListener);
    }

    componentWillUnmount() {
        global.ee.removeListener('update-file-info', this.updateFileInfo);
        global.ee.removeListener('play-audio', this.playAudioListener);

    }

}

export default AudioPlayer;
