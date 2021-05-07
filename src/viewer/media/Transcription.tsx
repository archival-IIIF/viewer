import React, {useEffect, useState} from 'react';
import IManifestData from "../../interface/IManifestData";
import * as DOMPurify from "dompurify";
import Config from "../../lib/Config";
import './transcription.css';
import Cache from "../../lib/Cache";
import {sanitizeRulesSet} from "../../lib/ManifestHelpers";

interface IPros {
    currentManifest: IManifestData;
    jumpToTime: (time: number) => void;
}

declare let global: {
    config: Config;
};

export default function Transcription(props: IPros) {

    const [currentPart, setCurrentPart] = useState<number>(0);

    const containerRef: React.RefObject<HTMLDivElement> = React.createRef();
    const currentRef: React.RefObject<HTMLDivElement> = React.createRef();

    useEffect(() => {
        Cache.ee.addListener('transcription-part-changed', setCurrentPart);

        return () => {
            Cache.ee.removeListener('transcription-part-changed', setCurrentPart);
        }
    }, [setCurrentPart])

    // update scroll
    React.useEffect(() => {
        if (containerRef.current && currentRef.current) {
            const containerEle = containerRef.current;
            const currentEle = currentRef.current;

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
    }, [currentPart, containerRef, currentRef]);


    const parts = [];
    let i = 0;
    for (const t of props.currentManifest.transcription) {
        let seconds = t.start;
        const hours = Math.floor(seconds / 3600)
        seconds = seconds - hours * 3600;
        const minutes = Math.floor(seconds / 60)
        seconds = seconds - minutes * 60;

        if (i === currentPart) {
            parts.push(
                <div className="aiiif-transcription-part active" onClick={() => props.jumpToTime(t.start)}
                     key={i++} ref={currentRef}>
                    <div className="aiiif-time-code">{hours}:{pad(minutes, 2)}:{pad(seconds, 2)}</div>
                    <div dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                        __html: DOMPurify.sanitize(t.content, sanitizeRulesSet)
                    }}/>
                </div>
            );
        } else {
            parts.push(
                <div className="aiiif-transcription-part" onClick={() => props.jumpToTime(t.start)} key={i++}>
                    <div className="aiiif-time-code">{hours}:{pad(minutes, 2)}:{pad(seconds, 2)}</div>
                    <div dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                        __html: DOMPurify.sanitize(t.content, sanitizeRulesSet)
                    }}/>
                </div>
            );
        }
    }

    return <div className="aiiif-transcription" ref={containerRef}>
        <div className="aiiif-box">
            {parts}
        </div>
        <div className="aiiif-box-spacer"/>
    </div>;
}

function pad(num: number, size: number) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}
