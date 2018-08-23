import React from "react";
import Manifest from "./lib/Manifest";
import ManifestHistory from "./lib/ManifestHistory";
import Nested from "./lib/Nested";
import InfoJson from "./lib/InfoJson";


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
            backgroundSize: ""
        };
    }


    render() {

        let id = this.state.item["@id"];
        let className = "item " + this.state.itemType;
        let label = this.state.item.label;
        let style = {
            backgroundImage: this.state.backgroundImage,
            backgroundSize: this.state.backgroundSize
        };
        if (id === this.state.selected) {
            className += " active";
        }

        return <div
            className={className}
            style={style}
            key={id}
            onClick={() => this.activateItem()}
            onDoubleClick={() => this.open()}
        >
            {label}
        </div>
    }


    open() {
        if (this.state.itemType === "folder") {
            global.ee.emitEvent('open-folder', [this.state.item["@id"]]);
        } else {
            this.openFile(this.state.item)
        }
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

                let url = file.thumbnail.service["@id"];
                InfoJson.get(url, function (url) {
                    let thumbnailUrl = url.replace("/info.json", "") + "/full/!" + width + "," + height + "/0/default.jpg";
                    this.setState({
                        backgroundImage: "url(" + thumbnailUrl + ")",
                        backgroundSize: width + "px " + height + "px"
                    });
                });


            } else if (file.thumbnail.hasOwnProperty("@id")) {
                this.setState({
                    backgroundImage: "url(" + file.thumbnail["@id"] + ")",
                    backgroundSize: width + "px " + height + "px"
                });
            }
        }
    }


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

        let id = file["@id"];
        let manifest = id;

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
                    window.location.assign(url);
                }
            }
        );


    }


    updateFileInfo = this.updateFileInfo.bind(this);

    updateFileInfo(data) {
        this.setState({
            selected: data["@id"]
        });
    }

    componentDidMount() {
        this.getThumbnail(this.state.item);
        global.ee.addListener('update-file-info', this.updateFileInfo);
    }

    omponentWillUnmount() {
        global.ee.removeListener('update-file-info', this.updateFileInfo);
    }

}

export default Item;