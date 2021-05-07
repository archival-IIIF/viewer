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

export default function Folder(props: IProps) {

    return <Splitter
        id="splitter-folder"
        a={<FolderView
            key={props.currentManifest.id}
            currentManifest={props.currentManifest}
            currentFolder={props.currentFolder}
            setCurrentManifest={props.setCurrentManifest}
            authDate={props.authDate}
        />}
        b={<FileInfo
            key={props.currentManifest.id}
            currentManifest={props.currentManifest}
        />}
        aSize={70}
        direction="vertical"
    />
}
