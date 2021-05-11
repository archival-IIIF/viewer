import * as React from 'react';
import ReactOpenSeadragon from './image/ReactOpenSeadragon';
import MediaPlayer from './media/MediaPlayer';
import PlainTextViewer from './plainText/PlainTextViewer';
import './viewer.css';
import PdfViewer from "./pdf/pdfViewer";
import {useContext} from "react";
import {AppContext} from "../AppContext";


export default function Viewer() {

    const {currentManifest, authDate} = useContext(AppContext);
    if (!currentManifest) {
        return <></>;
    }

    if (!currentManifest || !currentManifest.hasOwnProperty('resource')) {
        return <></>;
    }

    if (currentManifest.resource.type === 'imageService') {
        return  <div className="aiiif-viewer">
            <ReactOpenSeadragon
                source={currentManifest.resource.source}
                key={currentManifest.resource.source + authDate.toString()}
            />
        </div>;
    }

    if (currentManifest.resource.type === 'audio' || currentManifest.resource.type === 'video') {
        return <div className="aiiif-viewer">
            <MediaPlayer />
        </div>;
    }

    if (currentManifest.resource.type === 'plainText') {
        return <div className="aiiif-viewer">
            <PlainTextViewer />
        </div>;
    }

    if (currentManifest.resource.type === 'pdf') {
        return <PdfViewer />;
    }

    return <></>;
}
