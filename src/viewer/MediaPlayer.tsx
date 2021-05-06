import * as React from 'react';
import videojs, {VideoJsPlayerOptions} from 'video.js';
import Cache from '../lib/Cache';
import 'video.js/dist/video-js.css';
import Transcription from "./transcription/Transcription";
import IManifestData from "../interface/IManifestData";
import {hasTranscription} from "../lib/ManifestHelpers";
import Splitter from "../splitter/Splitter";
import './media-player.css';


interface IProps {
    currentManifest: IManifestData;
}

export default class MediaPlayer extends React.Component<IProps, {}> {

    private player?: videojs.Player;
    private videoNode: any;
    private currentTranscriptionPart = 0;
    private preload = 'metadata';

    constructor(props: IProps) {
        super(props);
        this.togglePlay = this.togglePlay.bind(this);
        this.jumpToTime = this.jumpToTime.bind(this);
        this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    }

    componentDidMount() {
        const resource: any = this.props.currentManifest.resource;
        const mime = resource.format;
        const file = resource.id;
        const sources: videojs.Tech.SourceObject[] = [{src: file, type: mime}];

        const videoJsPlayerOptions: VideoJsPlayerOptions = {
            sources: sources,
            height: 360,
            preload: this.preload,
            controls: true
        }

        this.player = videojs(this.videoNode, videoJsPlayerOptions, function onPlayerReady() {});

        Cache.ee.addListener('play-audio', this.togglePlay);
    }

    componentWillUnmount() {
        if (this.player) {
            this.player.dispose();
        }

        Cache.ee.removeListener('play-audio', this.togglePlay);
    }

    render() {

        if (!this.props.currentManifest.resource) {
            return <div />;
        }

        const resource: any = this.props.currentManifest.resource;
        if (resource.type === 'video') {
            return this.renderVideo();
        }

        return this.renderAudio();
    }

    renderVideo() {

        if (hasTranscription(this.props.currentManifest)) {
            return <Splitter
                id="video-splitter"
                a={
                    <div className="aiiif-player-container aiiif-video vjs-has-started">
                        <div data-vjs-player={true} style={{width: '100%'}}>
                            <video ref={(node) => this.videoNode = node} className="video-js"
                            preload={this.preload}  onTimeUpdate={this.handleTimeUpdate}/>
                        </div>
                    </div>
                }
                b={
                    <Transcription currentManifest={this.props.currentManifest}
                                  jumpToTime={this.jumpToTime}
                />}
                direction="horizontal"
            />;
        }

        return <div className="aiiif-player-container aiiif-video vjs-has-started">
            <div data-vjs-player={true} style={{width: '100%'}}>
                <video ref={(node) => this.videoNode = node} className="video-js"
                       preload={this.preload}/>
            </div>
        </div>;
    }

    renderAudio() {
        if (hasTranscription(this.props.currentManifest)) {
            return <div className="aiiif-player-container aiiif-audio">
                <div className="vjs-has-started">
                    <div data-vjs-player={true} style={{width: '100%', height: 30}}>
                        <audio ref={(node) => this.videoNode = node} className="video-js"
                               preload={this.preload} onTimeUpdate={this.handleTimeUpdate}/>
                    </div>
                </div>
                <Transcription currentManifest={this.props.currentManifest}
                               jumpToTime={this.jumpToTime} />
            </div>;
        }

        return <div className="vjs-has-started">
            <div data-vjs-player={true} style={{width: '100%', height: 30}}>
                <audio ref={(node) => this.videoNode = node} className="video-js"
                       preload={this.preload}/>
            </div>
        </div>;
    }

    togglePlay() {
        if (!this.player) {
            return;
        }

        this.player.paused() ? this.player.play() : this.player.pause();
    }

    handleTimeUpdate() {
        if (!this.player) {
            return;
        }

        const parts = this.props.currentManifest.transcription;
        let i = -1;
        const t = this.player.currentTime();
        for (const part of parts) {
            if (part.start > t) {
                let previous = (i === -1) ? 0 : i;
                if (previous !== this.currentTranscriptionPart) {
                    this.currentTranscriptionPart = previous;
                    Cache.ee.emit('transcription-part-changed', previous);
                }
                return;
            }
            i++;
        }
    }

    jumpToTime(timeCode: number) {
        if (!this.player) {
            return;
        }

        this.player.currentTime(timeCode);
        this.player.play();
    }
}
