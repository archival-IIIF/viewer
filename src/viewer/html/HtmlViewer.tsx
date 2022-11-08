import * as React from 'react';
import ViewerSpinner from '../ViewerSpinner';
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../AppContext";
import * as DOMPurify from "dompurify";
import {getCharsetFromHeader} from "../plainText/PlainTextViewer";
import chardet from "chardet";
import {Buffer} from "buffer";

export default function HtmlViewer() {

    const {currentManifest} = useContext(AppContext);
    const [loading, setLoading] = useState<boolean>(true);
    const [html, setHtml] = useState<string>('');

    useEffect(() => {
        if (currentManifest && currentManifest.resource) {
            const source = currentManifest.resource.id;
            fetch(source)
                .then(function(response) {
                    let charSet: string | undefined = getCharsetFromHeader(response);
                    return response.arrayBuffer().then(buffer => {
                        if (charSet) {
                            const decoder = new TextDecoder(charSet);
                            const text = decoder.decode(buffer);
                            setLoading(false);
                            setHtml(text)
                        }

                        const decoder0 = new TextDecoder();
                        let text = decoder0.decode(buffer);
                        const regex = /charset=([a-zA-Z0-9-]*)/g;
                        const found = text.match(regex);
                        if (found && found.length > 0) {
                            const encoding = found[0].slice(8);
                            const decoder = new TextDecoder(encoding);
                            text = decoder.decode(buffer);
                        }

                        charSet = chardet.detect(Buffer.from(buffer)) ?? undefined;
                        if (charSet) {
                            const decoder = new TextDecoder(charSet);
                            const text = decoder.decode(buffer);
                            setLoading(false);
                            setHtml(text)
                        }

                        setLoading(false);
                        setHtml(text);
                    });
                });
        }
    });

    if (!currentManifest) {
        return <></>;
    }

    if (loading) {
        return <ViewerSpinner show={loading} />;
    }

    return <div className="aiiif-viewer-html" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(html)}} />
}
