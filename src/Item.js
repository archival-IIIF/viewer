import React from "react";
import Manifest from "./lib/Manifest";
import ManifestHistory from "./lib/ManifestHistory";
import Nested from "./lib/Nested";
import InfoJson from "./lib/InfoJson";
import './css/item.css';

class Item extends React.Component {

    constructor(props) {

        super(props);

        let itemType = "";
        if (props.item["@type"] === "sc:Collection") {
            itemType = "folder";
        } else {
            itemType = "file";
        }

        this.state = {
            itemType: itemType,
            item: props.item,
            selected: props.selected,
            backgroundImage: "",
        };
    }


    render() {

        let id = this.state.item["@id"];
        let className = "item " + this.state.itemType;
        let label = this.state.item.label;
        let style = {
            backgroundImage: this.state.backgroundImage
        };
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


    open() {
        if (this.state.itemType === "folder") {
            global.ee.emitEvent('open-folder', [this.state.item["@id"]]);
        } else {
            this.openFile(this.state.item)
        }
    }

    getThumbnail() {

        let width = "72",
            height = "72",
            file = this.state.item;

        let t = this;

        if (file.hasOwnProperty("thumbnail")) {
            if (file.thumbnail.hasOwnProperty("service")) {

                this.hasThumbnailService = true;

                let url = file.thumbnail.service["@id"];
                InfoJson.get(url, function (url) {
                    let thumbnailUrl = url.replace("/info.json", "") + "/full/!" + width + "," + height + "/0/default.jpg";
                    t.setState({
                        backgroundImage: "url(" + thumbnailUrl + ")",
                    });
                });


            } else if (file.thumbnail.hasOwnProperty("@id")) {
                this.setState({
                    backgroundImage: "url(" + file.thumbnail["@id"] + ")",
                });
            }
        }
    }

    hasThumbnailService = false;


    activateItem() {

        let data = this.state.item;

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

        let manifest = file["@id"];

        Manifest.get(
            manifest,
            function (file) {

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
                    let win = window.open(url, "_target");
                    win.focus();
                }
            }
        );


    }

    openFolder(file) {
        if (this.hasThumbnailService && this.state.backgroundImage === "") {
            this.getThumbnail();
        }
    }

    updateFileInfo = this.updateFileInfo.bind(this);
    openFolder = this.openFolder.bind(this);

    updateFileInfo(data) {
        this.setState({
            selected: data["@id"]
        });
    }

    componentDidMount() {
        this.getThumbnail();
        global.ee.addListener('update-file-info', this.updateFileInfo);
        global.ee.addListener('open-folder', this.openFolder);
    }

    componentWillUnmount() {
        global.ee.removeListener('update-file-info', this.updateFileInfo);
        global.ee.removeListener('open-folder', this.openFolder);
    }

}

export default Item;