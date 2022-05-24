import * as React from 'react';
import Viewer from "../viewer/Viewer";
import Splitter from "../splitter/Splitter";
import FolderView from "../folder/FolderView";
import IManifestData from "../interface/IManifestData";
import {isSingleManifest} from "../lib/ManifestHelpers";
import {useContext} from "react";
import {AppContext} from "../AppContext";
import Config from "../lib/Config";

declare let global: {
    config: Config;
};

export default function Content3() {

    const {currentManifest} = useContext(AppContext);

    if (!currentManifest) {
        return <></>;
    }

    if (isSingleManifest(currentManifest)) {
        return <Viewer />;
    }

    const size = getSize(currentManifest);

    return <Splitter
        id="content"
        aSize={size}
        a={size > 0 ? <Viewer key={currentManifest.id}/> : undefined}
        b={<FolderView />}
        direction="horizontal"
        frozen={isAudio(currentManifest)}
    />;
}

function isAudio(currentManifest: IManifestData) {
    return currentManifest.resource && currentManifest.resource.type === 'audio';
}

function getSize(currentManifest: IManifestData): number {
    if (!currentManifest) {
        return 0;
    }

    const viewers = ['audioVideo', 'image', 'plain', 'pdf', 'html'];
    if (global.config.getHtmlViewer()) {
        viewers.push('html')
    }
    if (viewers.includes(currentManifest.itemsType )) {
        return 50;
    }

    return 0;
}
