import React from "react";
import './css/viewer.css';
import Nested from "./lib/Nested";
import OpenSeadragon from "./OpenSeadragon";
import MediaElement from "./MediaElement";
import PdfViewer from "./PdfViewer";
import InfoJson from "./lib/InfoJson";


class Viewer extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            data: null,
            itemType: null,
            source: null
        };
    }

    render() {

        let data = this.state.data;

        if (data === null) {
            return "";
        }

        if (this.state.itemType === "image") {
            return this.renderImage(data);
        }

        if (this.state.itemType === "audioVideo") {
            return this.renderAudioVideo(data);
        }

        if (this.state.itemType === "pdf") {
            return this.renderPdf(data);
        }

        return "";
    }

    renderImage(data) {
        return (
            <div id="viewer">
                <OpenSeadragon source={this.state.source} key={this.state.source} />
            </div>
        );
    }


    isImage(data) {
        if (!Nested.has(data, "sequences", 0, "canvases", 0, "images", 0, "resource", "service", "@id")) {
            return false;
        }

        return true;
    }

    renderAudioVideo(data) {


        let mime = data.mediaSequences[0].elements[0]["format"];
        let mediaType = mime.substr(0, 5);
        let file = data.mediaSequences[0].elements[0]["@id"];
        let sources = [{src: file, type: mime}];
        let config = {};
        let tracks = {};

        this.type = "audioVideo";

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



    isAudioVideo(data) {
        if (!Nested.has(data, "mediaSequences", 0, "elements", 0, "format")) {
            return false;
        }

        let mime = data.mediaSequences[0].elements[0]["format"];
        let mediaType = mime.substr(0, 5);
        if (mediaType !== "audio" && mediaType !== "video") {
            return false;
        }

        if (data.mediaSequences[0].elements[0]["@id"] === null) {
            return false;
        }

        return true;
    }


    renderPdf(data) {

        let element = data.mediaSequences[0].elements[0];
        let file = element["@id"];


        return (
            <div id="viewer">
                <PdfViewer file={file} key={file}/>
            </div>
        );
    }



    isPdf(data) {

        if (!Nested.has(data, "mediaSequences", 0, "elements", 0)) {
            return false;
        }

        let element = data.mediaSequences[0].elements[0];

        if (!element.hasOwnProperty("format") || element.format !== "application/pdf") {
            return false;
        }

        if (!element.hasOwnProperty("@id")) {
            return false;
        }

        true
    }


    open(data) {

        let t = this;
        if (this.isImage(data)) {
            let infoJsonUrl = data.sequences[0].canvases[0].images[0].resource.service["@id"];
            InfoJson.get(infoJsonUrl, function (url) {
                t.setState({
                    data: data,
                    itemType: "image",
                    source: url
                });
            });
            return;
        }

        let itemType = "";
        if (this.isAudioVideo(data)) {
            itemType = "audioVideo";

        } else if (this.isPdf(data)) {
            itemType = "pdf";
        }
        this.setState({
            data: data,
            itemType: itemType
        });
    }

    play(data) {

        if (this.type === "audioVideo") {
            document.getElementById("player1_html5").play();

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