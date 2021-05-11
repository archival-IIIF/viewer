import * as React from 'react';
import Viewer from "../viewer/Viewer";
import Splitter from "../splitter/Splitter";
import FolderView from "../folder/FolderView";
import IManifestData from "../interface/IManifestData";
import {isSingleManifest} from "../lib/ManifestHelpers";
import {useContext} from "react";
import {AppContext} from "../AppContext";


export default function Content3() {

    const {currentManifest} = useContext(AppContext);

    if (!currentManifest) {
        return <></>;
    }

    if (isSingleManifest(currentManifest)) {
        return <Viewer />;
    }

    const size = getSize(currentManifest);
    let key = "content" + size.toString();
    if(currentManifest) {
        key += currentManifest.id;
    }

    if (size === 0) {
        return <FolderView
            key={currentManifest.id}
        />;
    }

    if (isAudio(currentManifest)) {
        return <div className="aiiif-content-audio">
            <Viewer />
            <FolderView
                key={currentManifest.id}
            />
        </div>;
    }

    return <Splitter
        id="content"
        key={key}
        aSize={size}
        a={<Viewer />}
        b={<FolderView
            key={currentManifest.id}
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
