import React from "react";
import filesize from "file-size";
import iifLogo from "./icons/iiif.png";
import Interweave from 'interweave';

class FileInfo extends React.Component {

    constructor(props) {

        super(props);


        this.state = {
            data: null,
        };
    }

    render() {

        if (this.state.data === null || this.state.data === undefined) {
            return "";
        }

        if (typeof this.state.data === "string") {
            return <div id="file-info">{this.state.data}</div>;
        }

        let data = this.state.data;
        let metadata = data.metadata;
        let metadataView = [];
        if (this.state.data.hasOwnProperty("metadata")) {

            for (let i in metadata) {

                if (!metadata[i].hasOwnProperty("label") || !metadata[i].hasOwnProperty("value")) {
                    continue;
                }

                let label = metadata[i].label;
                let value = metadata[i].value;
                if (label === "Size") {
                    value = filesize(parseInt(value, 10)).human('si');
                }
                value = this.addBlankTarget(value);


                metadataView.push(<div key={i}>
                    <div className="label">{label}</div>
                    <div className="value">
                        <Interweave
                            tagName="div"
                            content={value}
                        />
                    </div>
                </div>);
            }
        }

        if (this.state.data.hasOwnProperty("logo")) {
            metadataView.push(<img key="providerLogo" id="provider-logo" src={this.state.data.logo} />);
        }
        }

        let manifestUrl = data["@id"];

        return (
            <div id="file-info">
                <h3>{data["label"]}</h3>
                {metadataView}
                <a id="iiif-logo"  href={manifestUrl} target="_blank">
                    <img src={iifLogo} title="IIIF-Manifest" alt="IIIF-Manifest" />
                </a>
            </div>
        );
    }

    updateFileInfo = this.updateFileInfo.bind(this);

    componentDidMount() {
        global.ee.addListener('update-file-info', this.updateFileInfo);
    }


    componentWillUnmount() {
        global.ee.removeListener('update-file-info', this.updateFileInfo);
    }

    addBlankTarget(input){
        let tmp = document.createElement("div");
        tmp.innerHTML = input;
        for (let i = 0; i < tmp.children.length; i++) {
            if (tmp.children[i].nodeName === "A") {
                tmp.children[i].target = "_blank"
            }
        }
        return tmp.innerHTML;
    }

    updateFileInfo(data) {

        this.setState({
            data: data
        });

        if (data !== null && data !== undefined) {
            let label = data["label"];
            window.history.pushState({}, label, "?manifest=" + data["@id"]);
        }

    }

}

export default FileInfo;
