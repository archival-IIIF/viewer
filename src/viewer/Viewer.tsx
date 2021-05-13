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

    if (currentManifest.images.length > 0) {
        return  <div className="aiiif-viewer">
            <ReactOpenSeadragon
                images={currentManifest.images}
                key={currentManifest.id + authDate.toString()}
            />
        </div>;
    }

    if (currentManifest.itemsType === 'audioVideo') {
        return <div className="aiiif-viewer">
            <MediaPlayer />
        </div>;
    }

    if (currentManifest.itemsType === 'plain') {
        return <div className="aiiif-viewer">
            <PlainTextViewer />
        </div>;
    }

    if (currentManifest.itemsType=== 'pdf') {
        return <PdfViewer />;
    }

    return <></>;
}
