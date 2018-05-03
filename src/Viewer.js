import React from "react";
import './css/viewer.css';
import Nested from "./lib/Nested";
import OpenSeadragon from "./OpenSeadragon";
import MediaElement from "./MediaElement";
import PdfViewer from "./PdfViewer";


class Viewer extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            data: null,
        };
    }

    render() {

        this.type = null;
        let data = this.state.data;

        if (data === null) {
            return "";
        }

        let image = this.renderImage(data);
        if (image) {
            return image;
        }

        let audioVideo = this.renderAudioVideo(data);
        if (audioVideo) {
            return audioVideo;
        }

        let pdf = this.renderPdf(data);
        if (pdf) {
            return pdf;
        }

        return "";

    }

    renderImage(data) {
        if (!Nested.has(data, "sequences", 0, "canvases", 0, "images", 0, "resource", "service", "@id")) {
            return false;
        }

        this.type = "image";

        let source = data.sequences[0].canvases[0].images[0].resource.service["@id"];
        return (
            <div id="viewer">
                <OpenSeadragon source={source} key={source} />
            </div>
        );
    }

    renderAudioVideo(data) {
        if (!Nested.has(data, "mediaSequences", 0, "elements", 0, "rendering", "format")) {
            return false;
        }

        let mime = data.mediaSequences[0].elements[0].rendering["format"];
        let mediaType = mime.substr(0, 5);
        if (mediaType !== "audio" && mediaType !== "video") {
            return false;
        }

        let file = data.mediaSequences[0].elements[0].rendering["@id"];
        if (file === null) {
            return false;
        }

        let sources = [{src: file, type: mime}];
        let config = {};
        let tracks = {};

        this.type = "audioVideo";

        return (
            <div id="viewer">
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


    renderPdf(data) {

        if (!Nested.has(data, "sequences", 0, "canvases", 0, "content", 0, "items", 0, "body")) {
            return false;
        }

        let body = data.sequences[0].canvases[0].content[0].items[0].body;

        if (!body.hasOwnProperty("type") || body.type !== "PDF") {
            return false;
        }

        if (!body.hasOwnProperty("id")) {
            return false;
        }

        let file = body.id;
        this.type = "pdf";


        return (
            <div id="viewer">
                <PdfViewer file={file} key={file}/>
            </div>
        );
    }


    open(data) {

        this.setState({
            data: data
        });

    }

    play(data) {
        if (this.type === "audioVideo") {
            document.getElementById("player1_html5").play();

        }
    }

    openListener = this.open.bind(this); // click
    playListener = this.play.bind(this);    // doubleClick

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