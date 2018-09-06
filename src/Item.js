import React from "react";
import Manifest from "./lib/Manifest";
import ManifestHistory from "./lib/ManifestHistory";
import './css/item.css';
import FolderImage from './icons/fa/folder.svg';
import FileImage from './icons/fa/file.svg';

class Item extends React.Component {

    constructor(props) {

        super(props);

        let itemType = "";
        if (props.item.type === "sc:Collection") {
            itemType = "folder";
        } else {
            itemType = "file";
        }

        this.state = {
            itemType: itemType,
            item: props.item,
            selected: props.selected,
        };
    }


    render() {

        let id = this.state.item.id;
        let className = "item " + this.state.itemType;
        let label = this.state.item.label;
        let style = {backgroundImage: this.getThumbnail()};
        if (id === this.state.selected) {
            className += " active";
        }

        return <div
            className={className}
            key={id}
            onClick={() => this.activateItem()}
            onDoubleClick={() => this.open()}
        >
            <div className="item-thumbnail" style={style} />
            <div className="item-label">{label}</div>
        </div>
    }

    getThumbnail() {

        if (this.state.item.thumbnail === undefined || !this.state.item.thumbnail.hasOwnProperty('id')) {
            if (this.state.item.type === "sc:Collection") {
                return `url(${FolderImage})`
            }

            return `url(${FileImage})`
        }

        let thumbnailUrl;
        if (this.state.item.thumbnail.hasOwnProperty('service')) {
            let width = "72",
                height = "72";
            let serviceUrl = this.state.item.thumbnail.service;
            thumbnailUrl = serviceUrl.replace("/info.json", "") + "/full/!" + width + "," + height + "/0/default.jpg";
        } else {
            thumbnailUrl = this.state.item.thumbnail.id
        }

        return `url(${thumbnailUrl})`
    }

    open() {
        if (this.state.itemType === "folder") {
            global.ee.emitEvent('open-folder', [this.state.item.id]);
        } else {
            this.openFile(this.state.item)
        }
    }

    activateItem() {

        let manifestData = this.state.item;

        Manifest.get(
            manifestData.id,
            function (manifestData) {
                ManifestHistory.pageChanged(manifestData.id, manifestData.label);
                global.ee.emitEvent('update-file-info', [manifestData]);
            }
        );


    }


    openFile(file) {

        let manifestId = file.id;

        Manifest.get(
            manifestId,
            function (file) {
                const type = file.resource.type;
                if (type === 'audioVideo') {
                    global.ee.emitEvent('play-audio', [file.resource.source]);
                } else if (type === 'file') {
                    let win = window.open(file.resource.source, "_target");
                    win.focus();
                }

            }
        );


    }


    updateFileInfo = this.updateFileInfo.bind(this);

    updateFileInfo(manifestData) {
        this.setState({
            selected: manifestData.id
        });
    }

    componentDidMount() {
        global.ee.addListener('update-file-info', this.updateFileInfo);
    }

    componentWillUnmount() {
        global.ee.removeListener('update-file-info', this.updateFileInfo);
        global.ee.removeListener('open-folder', this.openFolder);
    }

}

export default Item;