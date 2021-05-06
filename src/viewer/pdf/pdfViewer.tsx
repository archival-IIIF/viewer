import React from "react";
import IManifestData from "../../interface/IManifestData";


interface IProps {
    presentation: IManifestData;
}

export default function PdfViewer(props: IProps) {

    if (!props.presentation.resource) {
        return <></>;
    }

    const id = props.presentation.resource.id

    return <iframe className="aiiif-viewer" src={id} title={id}/>;
}
