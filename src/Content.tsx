import * as React from 'react';
import Viewer from "./viewer/Viewer";
import Splitter from "./splitter/Splitter";
import Folder from "./folder/Folder";
import IManifestData from "./interface/IManifestData";

interface IPros {
    currentManifest: IManifestData;
    currentFolder: IManifestData;
    authDate: number;
    setCurrentManifest: (id?: string) => void;
}

class Content extends React.Component<IPros, {}> {

    render() {

        const size = this.getSize();
        let key = "content" + size.toString();
        if(this.props.currentManifest && this.props.currentManifest.id) {
            key += this.props.currentManifest.id;
        }

        if (size === 0) {
            return <Folder
                key={this.props.currentManifest.id}
                currentManifest={this.props.currentManifest}
                currentFolder={this.props.currentFolder}
                setCurrentManifest={this.props.setCurrentManifest}
                authDate={this.props.authDate}
            />;
        }

        if (this.isAudio()) {
            return <div id="content-audio">
                <Viewer currentManifest={this.props.currentManifest} authDate={this.props.authDate}/>
                <Folder
                    key={this.props.currentManifest.id}
                    currentManifest={this.props.currentManifest}
                    currentFolder={this.props.currentFolder}
                    setCurrentManifest={this.props.setCurrentManifest}
                    authDate={this.props.authDate}
                />
            </div>;
        }

        return <Splitter
            id="content"
            key={key}
            aSize={size}
            a={<Viewer currentManifest={this.props.currentManifest} authDate={this.props.authDate}/>}
            b={<Folder
                key={this.props.currentManifest.id}
                currentManifest={this.props.currentManifest}
                currentFolder={this.props.currentFolder}
                setCurrentManifest={this.props.setCurrentManifest}
                authDate={this.props.authDate}
            />}
            direction="horizontal"
        />
    }

    isAudio() {
        const manifestData: any = this.props.currentManifest;
        if (!manifestData || !manifestData.hasOwnProperty('resource')) {
            return false;
        }

        if (manifestData.resource.type !== 'audio') {
            return false;
        }

        return true;
    }

    getSize(): number {
        const manifestData: any = this.props.currentManifest;
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
