import * as React from 'react';
import ViewerSpinner from '../ViewerSpinner';
import Nl2br from './Nl2br';
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../AppContext";

export default function PlainTextViewer() {

    const {currentManifest} = useContext(AppContext);
    const [loading, setLoading] = useState<boolean>(true);
    const [text, setText] = useState<string>('');

    useEffect(() => {
        if (currentManifest && currentManifest.resource) {
            const source = currentManifest.resource.id;
            fetch(source)
                .then(function(response) {
                    return response.text();
                })
                .then(function(text) {
                    setLoading(false);
                    setText(text);
                });
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
