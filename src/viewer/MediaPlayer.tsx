import * as React from 'react';
import videojs, {VideoJsPlayerOptions} from 'video.js';
import Cache from '../lib/Cache';
import 'video.js/dist/video-js.css';

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

        const videoJsPlayerOptions: VideoJsPlayerOptions = {
            sources: this.props.sources,
            tracks: this.props.tracks,
            width: this.props.width,
            height: this.props.height,
            poster: this.props.poster,
            preload: this.props.preload,
            controls: this.props.controls
        }

        this.player = videojs(this.videoNode, videoJsPlayerOptions, function onPlayerReady() {});

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

    play() {
        this.player.play();
    }
}
