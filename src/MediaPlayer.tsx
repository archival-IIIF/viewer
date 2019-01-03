import * as React from 'react';
import videojs from 'video.js';
require('video.js/dist/video-js.css');

declare const MediaElementPlayer: any;

interface IProps {
    sources?: videojs.Tech.SourceObject[];
    tracks?: videojs.TextTrackOptions[];
    options?: string;
    mediaType?: string;
    width?: number;
    height?: number;
    poster?: string;
    preload?: string;
    controls?: boolean;
    id?: string;
}

export default class MediaPlayer extends React.Component<IProps, any> {

    state = {};

    private player;
    private videoNode;

    componentDidMount() {
        // instantiate Video.js
        this.player = videojs(this.videoNode, this.props, function onPlayerReady() {});
    }

    // destroy player on unmount
    componentWillUnmount() {
        if (this.player) {
            this.player.dispose();
        }
    }

    render() {

        if (this.props.mediaType === 'video') {
            return <div className="vjs-has-started">
                <div data-vjs-player style={{width: '100%'}}>
                    <video ref={(node) => this.videoNode = node} className="video-js" preload={this.props.preload}/> :
                </div>
            </div>;
        }

        return <div className="vjs-has-started">
            <div data-vjs-player style={{width: '100%', height: 30}}>
                <audio ref={(node) => this.videoNode = node} className="video-js"
                       preload={this.props.preload}/> ;
            </div>
        </div>;
    }
}
