import React from "react";
import Loading from "./Loading";
import Nested from './lib/Nested';
import Manifest from "./lib/Manifest";
import ManifestHistory from "./lib/ManifestHistory";


class FolderView extends React.Component {

    constructor(props) {

        super(props);


        this.state = {
            data: false,
            selected: null,
            mode: "icon-view"
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

        let folderViewClassNames = "folder-view " + this.state.mode;

        return (
            <div id="folder-view-container">
                <h1>{this.state.data.label}</h1>
                <div className={folderViewClassNames}>{content}</div>
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
                    backgroundImage: "url(" + file.thumbnail.service["@id"] + "/full/!"+width+","+height+"/0/default.jpg)",
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
            data["@id"],
            function (data) {
                ManifestHistory.pageChanged(data["@id"], data["label"]);
                global.ee.emitEvent('update-file-info', [data]);
            }
        );


    }

    openFile(file) {

        console.log(file);

        let id = file["@id"];
        let manifest = id;

        Manifest.get(
            manifest,
            function(file) {

                if (typeof file === "string") {
                    alert(file);
                    return;
                }

                // audio/video
                if (Nested.has(file, "mediaSequences", 0, "elements", 0, "format")) {

                    let format = file.mediaSequences[0].elements[0].format;

                    if (format.substr(0, 5) === "audio" || format.substr(0, 5) === "video") {
                        let audioFile = file.mediaSequences[0].elements[0]["@id"];
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


    openFolder(itemId, selectedData, pageReload) {

        if (itemId === false) {
            alert("No manifest short ID given!");
            return;
        }

        let url = itemId;
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
                    t.openFolder(data["within"], data, false);
                    return;
                }

                let selected = null;
                if (selectedData !== undefined) {
                    selected = selectedData["@id"];
                } else {
                    selectedData = data;
                }

                let label = data["label"];
                t.setState({
                    data: data,
                    selected: selected
                });
                if (pageReload !== false) {
                    ManifestHistory.pageChanged(id, label);
                }
                global.ee.emitEvent('update-current-folder-id', [id]);
                global.ee.emitEvent('update-file-info', [selectedData]);
            }
        );

    }


    showListView() {
        this.setState({mode: "list-view"});
    }

    showIconView() {
        this.setState({mode: "icon-view"});
    }

    openFolder = this.openFolder.bind(this);
    showListView = this.showListView.bind(this);
    showIconView = this.showIconView.bind(this);

    componentDidMount() {
       global.ee.addListener('open-folder', this.openFolder);
       global.ee.addListener('show-list-view', this.showListView);
       global.ee.addListener('show-icon-view', this.showIconView);

        let id = Manifest.getIdFromCurrentUrl();
        this.openFolder(id);
    }

    componentWillUnmount() {
        global.ee.removeListener('open-folder', this.openFolder);
        global.ee.removeListener('show-list-view', this.showListView);
        global.ee.removeListener('show-icon-view', this.showIconView);
    }

}

export default FolderView;