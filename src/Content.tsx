import * as React from 'react';
import Viewer from "./viewer/Viewer";
import Splitter from "./splitter/Splitter";
import Folder from "./folder/Folder";
import IManifestData from "./interface/IManifestData";
import {isSingleManifest} from "./lib/ManifestHelpers";

interface IPros {
    currentManifest: IManifestData;
    currentFolder: IManifestData;
    authDate: number;
    setCurrentManifest: (id?: string) => void;
}

export default function Content(props: IPros) {


    if (isSingleManifest(props.currentManifest)) {
        return <Viewer currentManifest={props.currentManifest} authDate={props.authDate}/>;
    }

    const size = getSize(props.currentManifest);
    let key = "content" + size.toString();
    if(props.currentManifest && props.currentManifest.id) {
        key += props.currentManifest.id;
    }

    if (size === 0) {
        return <Folder
            key={props.currentManifest.id}
            currentManifest={props.currentManifest}
            currentFolder={props.currentFolder}
            setCurrentManifest={props.setCurrentManifest}
            authDate={props.authDate}
        />;
    }

    if (isAudio(props.currentManifest)) {
        return <div className="aiiif-content-audio">
            <Viewer currentManifest={props.currentManifest} authDate={props.authDate}/>
            <Folder
                key={props.currentManifest.id}
                currentManifest={props.currentManifest}
                currentFolder={props.currentFolder}
                setCurrentManifest={props.setCurrentManifest}
                authDate={props.authDate}
            />
        </div>;
    }

    return <Splitter
        id="content"
        key={key}
        aSize={size}
        a={<Viewer currentManifest={props.currentManifest} authDate={props.authDate}/>}
        b={<Folder
            key={props.currentManifest.id}
            currentManifest={props.currentManifest}
            currentFolder={props.currentFolder}
            setCurrentManifest={props.setCurrentManifest}
            authDate={props.authDate}
        />}
        direction="horizontal"
    />
}

function isAudio(currentManifest: IManifestData) {
    const manifestData: any = currentManifest;
    if (!manifestData || !manifestData.hasOwnProperty('resource')) {
        return false;
    }

    if (manifestData.resource.type !== 'audio') {
        return false;
    }

    return true;
}

function getSize(currentManifest: IManifestData): number {
    const manifestData: any = currentManifest;
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
