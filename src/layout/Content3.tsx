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
    return currentManifest.resource && currentManifest.resource.type;
}

function getSize(currentManifest: IManifestData): number {
    const manifestData: any = currentManifest;
    if (!manifestData) {
        return 0;
    }

    if (['audioVideo', 'image', 'plain', 'pdf'].includes(manifestData.itemsType )) {
        return 50;
    }

    return 0;
}
