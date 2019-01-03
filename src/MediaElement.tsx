import * as React from 'react';
import MediaElementPlayer from 'mediaelement';
const s = require('mediaelement/build/mediaelementplayer.min.css');
const t = require('mediaelement/build/mediaelement-flash-video.swf');

interface IProps {
    sources: string;
    tracks: string;
    options: string;
    mediaType: string;
    width?: string;
    height: string;
    poster?: string;
    preload: string;
    controls?: boolean;
    id: string;
}

export default class MediaElement extends React.Component<IProps, any> {

    state = {};

    success(media, node, instance) {
        // Your action when media was successfully loaded
    }

    error(media, node) {
        // Your action when media had an error loading
    }

    render() {

        const props = this.props;
        const sources = JSON.parse(props.sources);
        const tracks = JSON.parse(props.tracks);
        const sourceTags = [];
        const tracksTags = [];

        for (const i of sources) {
            if (sources.hasOwnProperty(i)) {
                const source = sources[i];
                sourceTags.push(`<source src="${source.src}" type="${source.type}">`);
            }
        }

        for (const i of tracks) {
            if (tracks.hasOwnProperty(i)) {
                const track = tracks[i];
                tracksTags.push(
                    `<track src="${track.src}" kind="${track.kind}"` +
                    `srclang="${track.lang}"${(track.label ? ` label=${track.label}` : '')}>`
                );
            }
        }

        const style = {width: props.width};
        const mediaBody = `${sourceTags.join('\n')}${tracksTags.join('\n')}`;
        const mediaHtml = props.mediaType === 'video' ?
            `<video id="${props.id}" width="${props.width}"
                height="${props.height}"${(props.poster ? ` poster=${props.poster}` : '')}
					${(props.controls ? ' controls' : '')}${(props.preload ? ` preload="${props.preload}"` : '')}>
					${mediaBody}
				</video>` :
            `<audio id="${props.id}" style={style} controls preload="${props.preload}">
					${mediaBody}
				</audio>`;

        return (<div dangerouslySetInnerHTML={{__html: mediaHtml}} />);

    }

    componentDidMount() {

        const options = Object.assign({}, JSON.parse(this.props.options), {
            // Read the Notes below for more explanation about how to set up the path for shims
            pluginPath: './static/media/',
            success: (media, node, instance) => this.success(media, node, instance),
            error: (media, node) => this.error(media, node)
        });

        this.setState({player: new MediaElementPlayer(this.props.id, options)});
    }

    componentWillUnmount() {

        if (this.state['player']) {
            this.state['player'].remove();
            this.setState({player: null});
        }
    }
}
