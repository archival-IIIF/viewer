import * as React from 'react';
import videojs from 'video.js';
import Cache from './lib/Cache';
require('video.js/dist/video-js.css');

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

export default class MediaPlayer extends React.Component<IProps, {}> {

    private player: any;
    private videoNode: any;

    constructor(props: IProps) {
        super(props);
        this.play = this.play.bind(this);
    }

    componentDidMount() {
        // instantiate Video.js
        this.player = videojs(this.videoNode, this.props, function onPlayerReady() {});

        Cache.ee.addListener('play-audio', this.play);
    }

    // destroy player on unmount
    componentWillUnmount() {
        if (this.player) {
            this.player.dispose();
        }

        Cache.ee.removeListener('play-audio', this.play);
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

    play(data: any) {
        this.player.play();
    }
}
