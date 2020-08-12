import * as React from 'react';
import FolderView from "./FolderView";
import Splitter from "../splitter/Splitter";
import FileInfo from "../fileInfo/FileInfo";
import IManifestData from "../interface/IManifestData";

interface IProps {
    currentManifest: IManifestData;
    currentFolder: IManifestData;
    authDate: number;
    setCurrentManifest: (id?: string) => void;
}

class Folder extends React.Component<IProps, {}> {

    render() {
        return <Splitter
            id="splitter-folder"
            a={<FolderView
                key={this.props.currentManifest.id}
                currentManifest={this.props.currentManifest}
                currentFolder={this.props.currentFolder}
                setCurrentManifest={this.props.setCurrentManifest}
                authDate={this.props.authDate}
            />}
            b={<FileInfo
                key={this.props.currentManifest.id}
                currentManifest={this.props.currentManifest}
            />}
            aSize={70}
            direction="vertical"
        />
    }
}

export default Folder;
