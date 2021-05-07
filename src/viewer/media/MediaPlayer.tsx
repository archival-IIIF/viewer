import React, {useRef, useEffect} from 'react';
import videojs, {VideoJsPlayerOptions} from 'video.js';
import Cache from '../../lib/Cache';
import 'video.js/dist/video-js.css';
import "./vjsForest.css";
import Transcription from "./Transcription";
import IManifestData from "../../interface/IManifestData";
import {hasTranscription} from "../../lib/ManifestHelpers";
import Splitter from "../../splitter/Splitter";
import './media-player.css';


interface IProps {
    currentManifest: IManifestData;
}

export default function MediaPlayer(props: IProps) {

    const player = useRef<videojs.Player>();
    let videoNode: any = React.createRef();
    let currentTranscriptionPart = 0;
    const preload = 'metadata';


    useEffect(() => {
        const togglePlay = () => {
            if (!player.current) {
                return;
            }

            player.current.paused() ? player.current.play() : player.current.pause();
        }

        const resource: any = props.currentManifest.resource;
        const mime = resource.format;
        const file = resource.id;
        const sources: videojs.Tech.SourceObject[] = [{src: file, type: mime}];

        const videoJsPlayerOptions: VideoJsPlayerOptions = {
            sources: sources,
            height: 360,
            preload: preload,
            controls: true
        }

        player.current = videojs(videoNode, videoJsPlayerOptions);

        Cache.ee.addListener('play-audio', togglePlay);

        return () => {
            Cache.ee.removeListener('play-audio', togglePlay);
        }
    })


    const renderVideo = () => {

        if (hasTranscription(props.currentManifest)) {
            return <Splitter
                id="video-splitter"
                a={
                    <div className="aiiif-media-player-container">
                        <video ref={(node) => videoNode = node} className="video-js aiiif-video-player vjs-theme-forest"
                               preload={preload} onTimeUpdate={handleTimeUpdate}/>
                    </div>
                }
                b={
                    <Transcription currentManifest={props.currentManifest}
                                   jumpToTime={jumpToTime}
                    />}
                direction="horizontal"
            />;
        }

        return <div className="aiiif-media-player-container">
            <video ref={(node) => videoNode = node} className="video-js aiiif-video-player vjs-theme-forest"
                   preload={preload}/>
        </div>;
    }

    const renderAudio = () => {
        if (hasTranscription(props.currentManifest)) {
            return <div className="aiiif-media-player-container">
                <audio ref={(node) => videoNode = node} className="video-js aiiif-audio-player vjs-theme-forest"
                       preload={preload} onTimeUpdate={handleTimeUpdate}/>
                <Transcription currentManifest={props.currentManifest}
                               jumpToTime={jumpToTime} />
            </div>;
        }

        return <div className="aiiif-media-player-container">
            <audio ref={(node) => videoNode = node} className="video-js aiiif-audio-player vjs-theme-forest"
                   preload={preload}/>
        </div>;
    }

    const handleTimeUpdate = () => {
        if (!player.current) {
            return;
        }

        const parts = props.currentManifest.transcription;
        let i = -1;
        const t = player.current.currentTime();
        for (const part of parts) {
            if (part.start > t) {
                let previous = (i === -1) ? 0 : i;
                if (previous !== currentTranscriptionPart) {
                    currentTranscriptionPart = previous;
                    Cache.ee.emit('transcription-part-changed', previous);
                }
                return;
            }
            i++;
        }
    }

    const jumpToTime = (timeCode: number) => {
        if (!player.current) {
            return;
        }

        player.current.currentTime(timeCode);
        player.current.play();
    }

    if (!props.currentManifest.resource) {
        return <></>;
    }

    const resource: any = props.currentManifest.resource;
    if (resource.type === 'video') {
        return renderVideo();
    }

    return renderAudio();
}
