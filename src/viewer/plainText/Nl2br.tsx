import * as React from 'react';
import UrlValidation from '../../lib/UrlValidation';

interface IProps {
    text: string;
    urlTransformation?: boolean;
}

export default function Nl2br(props: IProps) {

    return <>{props.text.split('\n').map(function(item: string, i: number) {
        if (props.urlTransformation === true && UrlValidation.isURL(item)) {
            return <span key={i}><a href={item} target="_blank" rel="noopener noreferrer">{item}</a><br /></span>;
        }

        return <span key={i} style={{whiteSpace: 'pre'}}>{item}<br /></span>;
    })}</>;
}
