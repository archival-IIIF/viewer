import * as React from 'react';
import UrlValidation from './lib/UrlValidation';

interface IProps {
    text: string;
    urlTranformation?: boolean;
}

class Nl2br extends React.Component<IProps, {}> {

    render() {
        const t = this;
        return this.props.text.split('\n').map(function(item: string, i: number) {
            if (t.props.urlTranformation === true && UrlValidation.isURL(item)) {
                return <span key={i}><a href={item} target="_blank" rel="noopener">{item}</a><br /></span>;
            }

            return <span key={i}>{item}<br /></span>;
        });
    }
}

export default Nl2br;
