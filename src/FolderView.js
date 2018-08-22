import React from "react";
import Loading from "./Loading";
import Item from "./Item";
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
            content.push(
                <Item item={folder} selected={this.state.selected} key={folder["@id"]} />
            );
        }
        for (let key in files) {

            let file = files[key];

            content.push(
                <Item item={file} selected={this.state.selected} key={file["@id"]} />
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

    openFolder(itemId, selectedData, pageReload) {

        if (itemId === false) {
            alert("No manifest ID given!");
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

    openFolder = this.openFolder.bind(this);


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
       global.ee.addListener('show-list-view', this.showListView);
       global.ee.addListener('show-icon-view', this.showIconView);
       global.ee.addListener('open-folder', this.openFolder);


        let id = Manifest.getIdFromCurrentUrl();
        this.openFolder(id);
    }

    componentWillUnmount() {
        global.ee.removeListener('show-list-view', this.showListView);
        global.ee.removeListener('show-icon-view', this.showIconView);
        global.ee.removeListener('open-folder', this.openFolder);

    }

}

export default FolderView;