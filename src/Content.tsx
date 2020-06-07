import * as React from 'react';
import Viewer from "./viewer/Viewer";
import Splitter from "./splitter/Splitter";
import Folder from "./Folder";
import IManifestData from "./interface/IManifestData";

interface IPros {
    data: IManifestData | null;
}

class Content extends React.Component<IPros, {}> {

    render() {

        const size = this.getSize();
        let key = "content" + size.toString();
        if(this.props.data && this.props.data.id) {
            key += this.props.data.id;
        }

        if (size === 0) {
            return <Folder data={this.props.data}/>;
        }

        if (this.isAudio()) {
            return <div id="content-audio">
                <Viewer data={this.props.data}/>
                <Folder data={this.props.data}/>
            </div>;
        }

        return <Splitter
            id="content"
            key={key}
            aSize={size}
            a={<Viewer data={this.props.data}/>}
            b={<Folder data={this.props.data}/>}
            direction="horizontal"
        />
    }

    isAudio() {
        const manifestData: any = this.props.data;
        if (!manifestData || !manifestData.hasOwnProperty('resource')) {
            return false;
        }

        if (manifestData.resource.type !== 'audio') {
            return false;
        }

        return true;
    }

    getSize(): number {
        const manifestData: any = this.props.data;
        if (!manifestData || !manifestData.hasOwnProperty('resource')) {
            return 0;
        }

        if (
            manifestData.resource.type === 'imageService' ||
            manifestData.resource.type === 'video' ||
            manifestData.resource.type === 'audio' ||
            manifestData.resource.format === 'text/plain' ||
            manifestData.resource.format === 'application/pdf'
        ) {
            return 50;
        }

        return 0;
    }
}

export default Content;
