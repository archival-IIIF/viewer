import React, {useRef, useEffect, useContext} from 'react';
import videojs from 'video.js';
import Cache from '../../lib/Cache';
import 'video.js/dist/video-js.css';
import "./vjsForest.css";
import Transcription from "./Transcription";
import {hasTranscription} from "../../lib/ManifestHelpers";
import Splitter from "../../splitter/Splitter";
import './media-player.css';
import {AppContext} from "../../AppContext";
import Player from "video.js/dist/types/player";
import {SourceObject} from "video.js/dist/types/tech/tech";

type VideoJsPlayerOptions = Parameters<typeof videojs>[1]

export default function MediaPlayer() {

    const {currentManifest} = useContext(AppContext);
    const player = useRef<Player>(null);
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

        Cache.ee.addListener('play-audio', togglePlay);

        return () => {
            Cache.ee.removeListener('play-audio', togglePlay);
        }
    })

    useEffect(() => {
        if (currentManifest && currentManifest.resource) {
            const mime = currentManifest.resource.format;
            const file = currentManifest.resource.id;
            const sources: SourceObject[] = [{src: file, type: mime}];

            if (player.current) {
                player.current.selectSource(sources);
            } else {
                const videoJsPlayerOptions: VideoJsPlayerOptions = {
                    sources: sources,
                    height: 360,
                    preload: preload,
                    controls: true
                }

                player.current = videojs(videoNode, videoJsPlayerOptions);
            }
        }
    })

    if (!currentManifest) {
        return <></>;
    }

    const refFunc = (node: HTMLVideoElement | null) => {
        videoNode = node
    }

    const renderVideo = () => {

        if (hasTranscription(currentManifest)) {
            return <Splitter
                id="video-splitter"
                a={
                    <div className="aiiif-media-player-container">
                        <video ref={refFunc} className="video-js aiiif-video-player vjs-theme-forest"
                               preload={preload} onTimeUpdate={handleTimeUpdate} autoPlay={true}/>
                    </div>
                }
                b={<Transcription jumpToTime={jumpToTime}/>}
                direction="horizontal"
            />;
        }

        return <div className="aiiif-media-player-container">
            <video ref={refFunc} className="video-js aiiif-video-player vjs-theme-forest"
                   preload={preload} autoPlay={true}/>
        </div>;
    }

    const renderAudio = () => {
        if (hasTranscription(currentManifest)) {
            return <div className="aiiif-media-player-container">
                <audio ref={refFunc} className="video-js aiiif-audio-player vjs-theme-forest"
                       preload={preload} onTimeUpdate={handleTimeUpdate} autoPlay={true}/>
                <Transcription jumpToTime={jumpToTime} />
            </div>;
        }

        return <div className="aiiif-media-player-container">
            <audio ref={refFunc} className="video-js aiiif-audio-player vjs-theme-forest"
                   preload={preload} autoPlay={true}/>
        </div>;
    }

    const handleTimeUpdate = () => {
        if (!player.current) {
            return;
        }

        const parts = currentManifest.transcription;
        let i = -1;
        const t = player.current.currentTime();
        for (const part of parts) {
            if (t && part.start > t) {
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

    if (!currentManifest.resource) {
        return <></>;
    }

    if (currentManifest.resource.type === 'video') {
        return renderVideo();
    }

    return renderAudio();
}
