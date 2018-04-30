import React from "react";
import './css/audio-player.css';
import MediaElement from './MediaElement';
import Nested from "./lib/Nested";

class AudioPlayer extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            file: null
        };
    }

    render() {

        if (this.state.file === null) {
            return "";
        }

        let sources = [{src: this.state.file, type: 'audio/mp3'}];
        let config = {};
        let tracks = {};

        return (
            <div id="audio-player">
                <MediaElement
                    id="player1"
                    mediaType="audio"
                    preload="metadata"
                    controls
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

            this.setState({
                file: null,
            });

            return;
        }

        let format = data.mediaSequences[0].elements[0].rendering["format"];
        if (format.substr(0, 5) !== "audio") {

            this.setState({
                file: null,
            });

            return;
        }

        let file = data.mediaSequences[0].elements[0].rendering["@id"];

        if (this.state.file !== null) {
            document.getElementById("player1_html5").src = file;
            return;
        }

        this.setState({
            file: file,
        });
    }

    updateFileInfo = this.showAudio.bind(this);
    playAudio = this.playAudio.bind(this);

    componentDidMount() {
        global.ee.addListener('update-file-info', this.updateFileInfo);
        global.ee.addListener('play-audio', this.playAudio);
    }

    componentWillUnmount() {
        global.ee.removeListener('update-file-info', this.updateFileInfo);
        global.ee.removeListener('play-audio', this.playAudio);

    }

}

export default AudioPlayer;
