import * as React from 'react';
import ViewerSpinner from '../ViewerSpinner';
import Nl2br from './Nl2br';
import {useEffect, useState} from "react";

interface IProps {
    source: string;
}

export default function PlainTextViewer(props: IProps) {

    const [loading, setLoading] = useState<boolean>(true);
    const [text, setText] = useState<string>('');

    useEffect(() => {
        fetch(props.source)
            .then(function(response) {
                return response.text();
            })
            .then(function(text) {
                setLoading(false);
                setText(text);
            });
    });

    if (loading) {
        return <ViewerSpinner show={loading} />;
    }

    return <div className="aiiif-plain-text">
        <Nl2br text={text} />
    </div>;
}
