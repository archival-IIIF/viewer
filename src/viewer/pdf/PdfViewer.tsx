import React, {useContext} from "react";
import {AppContext} from "../../AppContext";

export default function PdfViewer() {

    const {currentManifest} = useContext(AppContext);
    if (!currentManifest || !currentManifest.resource) {
        return <></>;
    }

    const id = currentManifest.resource.id;

    return <iframe className="aiiif-viewer" src={id} title={id}/>;
}
