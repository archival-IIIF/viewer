import * as React from 'react';
import ViewerSpinner from '../ViewerSpinner';
import Nl2br from './Nl2br';
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../AppContext";
import chardet from 'chardet';
import {Buffer} from 'buffer';

export default function PlainTextViewer() {

    const {currentManifest} = useContext(AppContext);
    const [loading, setLoading] = useState<boolean>(true);
    const [text, setText] = useState<string>('');

    useEffect(() => {
        if (currentManifest && currentManifest.resource) {
            const source = currentManifest.resource.id;
            fetch(source)
                .then(function(response) {
                    let charSet: string | undefined = getCharsetFromHeader(response);
                    response.arrayBuffer().then(buffer => {
                        if (!charSet) {
                            charSet = chardet.detect(Buffer.from(buffer)) ?? undefined;
                        }
                        const decoder = new TextDecoder(charSet);
                        const text = decoder.decode(buffer);
                        setLoading(false);
                        setText(text);
                    });
                })
        }
    });

    if (!currentManifest) {
        return <></>;
    }

    if (loading) {
        return <ViewerSpinner show={loading} />;
    }

    return <div className="aiiif-plain-text">
        <Nl2br text={text} />
    </div>;
}

export function getCharsetFromHeader(response: Response): string | undefined {
    const contentType = response.headers.get('content-type');
    if (!contentType) {
        return undefined;
    }
    for (const entry of contentType.split(';')) {
        const entryTrimmed = entry.trim();
        if (entryTrimmed.startsWith('charset=')) {
            return entryTrimmed.slice(8, entryTrimmed.length);
        }
    }

    return undefined;
}
