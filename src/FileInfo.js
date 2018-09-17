import React from "react";
import iifLogo from "./icons/iiif.png";
import Interweave from 'interweave';
import { translate, Trans } from 'react-i18next';

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

        let manifestData = this.state.data;

        let metadataView = [];
        if (manifestData.metadata !== undefined) {
            for (let label in manifestData.metadata) {
                metadataView.push(<div key={label}>
                    <div className="label">{label}</div>
                    <div className="value">
                        <Interweave
                            tagName="div"
                            content={manifestData.metadata[label]}
                        />
                    </div>
                </div>);
            }
        }

        if (manifestData.attribution) {
            metadataView.push(<div key="attribution">
                <div className="label"><Trans i18nKey='attribution' /></div>
                <div className="value">{manifestData.attribution}</div>
            </div>);
        }

        if (manifestData.license !== undefined) {
            metadataView.push(<div key="termsOfUsage">
                <div className="label"><Trans i18nKey='license' /></div>
                <div className="value"><a href={manifestData.license}>{manifestData.license}</a></div>
            </div>);
        }

        let logo = manifestData.logo;
        if (logo !== null) {
            metadataView.push(<img key="providerLogo" id="provider-logo" src={logo} alt="Logo" title="Logo" />);
        }

        return (
            <div id="file-info">
                <h3>{manifestData.label}</h3>
                {metadataView}
                <a id="iiif-logo"  href={manifestData.id} target="_blank">
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
    }



    isURL(str) {
        let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return pattern.test(str);
    }


}

export default translate('common')(FileInfo);
