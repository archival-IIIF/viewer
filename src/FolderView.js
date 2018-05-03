import React from "react";
import Loading from "./Loading";
import Nested from './lib/Nested';
import Manifest from "./lib/Manifest";


class FolderView extends React.Component {

    constructor(props) {

        super(props);


        this.state = {
            data: false,
            selected: null
        };
    }



    render() {

        if (!this.state.data) {
            return (
                <Loading/>
            );
        }

        let files = this.state.data.manifests;
        let folders = this.state.data.collections;

        if (files === undefined && folders === undefined) {
            return (
                <div id="folder-view-container">
                    <h1>{this.state.data.label}</h1>
                    <div className="empty">This folder is empty</div>
                </div>
            );
        }


        let content = [];
        for (let key in folders) {

            let folder = folders[key];
            let className = "item folder";
            let id = folder["@id"];
            if (id === this.state.selected) {
                className += " active";
            }
            content.push(
                <div
                    className={className}
                    key={id}
                    onClick={() => this.activateItem(folder)}
                    onDoubleClick={() => this.openFolder(id)}
                >
                    {folders[key].label}
                </div>
            );
        }
        for (let key in files) {

            let className = "item file";
            let file = files[key];
            let id = file["@id"];
            let label = files[key].label;
            if (id === this.state.selected) {
                className += " active";
            }

            let style = this.getThumbnail(file);

            content.push(
                <div
                    className={className}
                    style={style}
                    key={id}
                    onClick={() => this.activateItem(file)}
                    onDoubleClick={() => this.openFile(file)}
                >
                    {label}
                </div>
            );
        }

        return (
            <div id="folder-view-container">
                <h1>{this.state.data.label}</h1>
                <div className="folder-view">{content}</div>
            </div>
        );
    }


    getThumbnail(file, width, height) {

        if (width === undefined) {
            width = "72";
        }
        if (height === undefined) {
            height = width;
        }

        if (file.hasOwnProperty("thumbnail")) {
            if (file.thumbnail.hasOwnProperty("service")) {
                return {
                    backgroundImage: "url(" + file.thumbnail.service["@id"] + "/full/"+width+","+height+"/0/default.jpg)",
                    backgroundSize: width+"px "+height+"px"
                };
            } else if (file.thumbnail.hasOwnProperty("@id")) {
                return {
                    backgroundImage: "url(" + file.thumbnail["@id"] + ")",
                    backgroundSize: width+"px "+height+"px"
                };
            }
        }

        return {};
    }

    activateItem(data) {

        this.setState({
            selected: data["@id"]
        });

        Manifest.get(
            data["@id"] + "/manifest.json",
            function (data) {
                global.ee.emitEvent('update-file-info', [data]);
            }
        );


    }

    openFile(file) {
        let id = file["@id"];
        let manifest = id+"/manifest.json";

        Manifest.get(
            manifest,
            function(file) {

                if (typeof file === "string") {
                    alert(file);
                    return;
                }

                // audio/video
                if (Nested.has(file, "mediaSequences", 0, "elements", 0, "rendering", "format")) {

                    let format = file.mediaSequences[0].elements[0].rendering.format;

                    if (format.substr(0, 5) === "audio" || "video") {
                        let audioFile = file.mediaSequences[0].elements[0].rendering["@id"];
                        global.ee.emitEvent('play-audio', [audioFile]);
                        return;
                    }
                }

                // open unsupported file
                let url = Nested.get(file, 'mediaSequences', 0, 'elements', 0, '@id');
                if (url) {
                    window.location.assign(url);
                }
            }
        );


    }


    openFolder(itemId, selectedData) {

        if (itemId === false) {
            alert("No manifest short ID given!");
            return;
        }

        let url = itemId+"/manifest.json";
        let t = this;

        Manifest.get(
            url,
            function(data) {

                if (typeof data === "string") {
                    alert(data);
                    return;
                }

                let id = data["@id"];
                if (data["@type"] !== "sc:Collection") {
                    t.openFolder(data["within"], data);
                    return;
                }

                let selected = null;
                if (selectedData !== undefined) {
                    selected = selectedData["@id"];
                }

                let shortId = Manifest.getShortId(id);
                let label = data["label"];
                t.setState({
                    data: data,
                    selected: selected
                });
                window.history.pushState({}, label, shortId);
                global.ee.emitEvent('update-current-folder-id', [id]);
                global.ee.emitEvent('update-file-info', [selectedData]);
            }
        );

    }

    openFolder = this.openFolder.bind(this);

    componentDidMount() {
       global.ee.addListener('open-folder', this.openFolder);

        let id = Manifest.getIdFromCurrentUrl();
        this.openFolder(id);
    }

    componentWillUnmount() {
        global.ee.removeListener('open-folder', this.openFolder);
    }

}

export default FolderView;