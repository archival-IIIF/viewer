import * as React from 'react';
import IManifestData from "../../interface/IManifestData";
import * as DOMPurify from "dompurify";
import Config from "../../lib/Config";
import './transcription.css';
import Cache from "../../lib/Cache";

interface IPros {
    currentManifest: IManifestData;
    jumpToTime: (time: number) => void;
}

interface IState {
    currentPart: number;
}

declare let global: {
    config: Config;
};

export default class Transcription extends React.Component<IPros, IState> {

    private readonly containerRef: React.RefObject<HTMLDivElement>;
    private readonly currentRef: React.RefObject<HTMLDivElement>;

    constructor(props: IPros) {
        super(props);

        this.state = {currentPart: 0};
        this.containerRef = React.createRef();
        this.currentRef = React.createRef();

        this.partChanged = this.partChanged.bind(this);
    }

    componentDidMount() {
        Cache.ee.addListener('transcription-part-changed', this.partChanged);
    }

    componentWillUnmount() {
        Cache.ee.removeListener('transcription-part-changed', this.partChanged);
    }

    render() {
        return <div className="aiiif-transcription" ref={this.containerRef}>
            <div className="aiiif-box" >
                {this.renderTranscriptParts()}
            </div>
            <div className="aiiif-box-spacer" />
        </div>;
    }

    renderTranscriptParts() {
        const parts = [];
        let i = 0;
        for (const t of this.props.currentManifest.transcription) {
            let seconds = t.start;
            const hours = Math.floor(seconds / 3600)
            seconds = seconds - hours * 3600;
            const minutes = Math.floor(seconds / 60)
            seconds = seconds - minutes * 60;

            if (!this.state) {
                return [];
            }

            if (i === this.state.currentPart) {
                parts.push(
                    <div className="aiiif-transcription-part active" onClick={() => this.props.jumpToTime(t.start)}
                         key={i++} ref={this.currentRef}>
                        <div className="aiiif-time-code">{hours}:{this.pad(minutes, 2)}:{this.pad(seconds, 2)}</div>
                        <div dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t.content, global.config.getSanitizeRulesSet())
                        }} />
                    </div>
                );
            } else {
                parts.push(
                    <div className="aiiif-transcription-part" onClick={() => this.props.jumpToTime(t.start)} key={i++}>
                        <div className="aiiif-time-code">{hours}:{this.pad(minutes, 2)}:{this.pad(seconds, 2)}</div>
                        <div dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                            __html: DOMPurify.sanitize(t.content, global.config.getSanitizeRulesSet())
                        }} />
                    </div>
                );
            }
        }

        return parts;
    }

    pad(num: number, size: number) {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    partChanged(currentPart: number) {
        this.setState({currentPart}, () => this.updateScroll())
    }

    updateScroll() {
        if (this.containerRef.current && this.currentRef.current) {
            const containerEle = this.containerRef.current;
            const currentEle = this.currentRef.current;

            const outside = (containerEle.offsetHeight + containerEle.scrollTop) -
                (currentEle.offsetTop + currentEle.offsetHeight);
            if (outside < 0) {
                containerEle.scrollTo(0, containerEle.scrollTop + -1 * outside + 20);
            } else if (outside > containerEle.offsetHeight) {
                containerEle.scrollTo(
                    0,
                    containerEle.scrollTop - outside + containerEle.offsetHeight - 160
                );
            }
        }
    }
}
