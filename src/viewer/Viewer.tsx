import * as React from 'react';
import ReactOpenSeadragon from './image/ReactOpenSeadragon';
import MediaPlayer from './media/MediaPlayer';
import IManifestData from '../interface/IManifestData';
import PlainTextViewer from './plainText/PlainTextViewer';
import './viewer.css';
import PdfViewer from "./pdf/pdfViewer";

interface IProps {
    currentManifest: IManifestData;
    authDate: number;
}


export default function Viewer(props: IProps) {

    const manifestData: any = props.currentManifest;

    if (!manifestData || !manifestData.hasOwnProperty('resource')) {
        return <></>;
    }

    if (manifestData.resource.type === 'imageService') {
        return <Image {...props} />;
    }

    if (manifestData.resource.type === 'audio' || manifestData.resource.type === 'video') {
        return <AudioVideo {...props} />;
    }

    if (manifestData.resource.type === 'plainText') {
        return <PlainText {...props} />;
    }

    if (manifestData.resource.type === 'pdf') {
        return <PdfViewer presentation={manifestData} />;
    }

    return <></>;
}

function Image(props: IProps) {
    const resource: any = props.currentManifest.resource;
    return (
        <div className="aiiif-viewer">
            <ReactOpenSeadragon
                source={resource.source}
                key={resource.source + props.authDate.toString()}
                authDate={props.authDate}
            />
        </div>
    );
}

function PlainText(props: IProps) {
    const resource: any = props.currentManifest.resource;
    return (
        <div className="aiiif-viewer">
            <PlainTextViewer source={resource.id} key={resource.id}/>
        </div>
    );
}

function AudioVideo(props: IProps) {

    if (!props.currentManifest.resource) {
        return <></>;
    }

    const resource: any = props.currentManifest.resource;

    return (
        <div className="aiiif-viewer">
            <MediaPlayer key={resource.id} currentManifest={props.currentManifest}/>
        </div>
    );
}
