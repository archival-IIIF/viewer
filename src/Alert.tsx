import * as React from 'react';
import Cache from './lib/Cache';
import UrlValidation from './lib/UrlValidation';
require('./css/modal.css');
import {translate} from 'react-i18next';

interface IState {
    visible: boolean;
    title?: string;
    titleJsx?: JSX.Element;
    body?: string;
    bodyJsx?: JSX.Element;
}



class Alert extends React.Component<{}, IState> {

    constructor(props) {
        super(props);

        this.state = {
            visible: false
        };

        this.open = this.open.bind(this);
    }

    render() {

        if (!this.state.visible) {
            return '';
        }

        return (
            <div className="modal">
                <div className="modal-content">
                    <span className="close"  onClick={() => this.close()}>&times;</span>
                    {this.renderTitle()}
                    {this.renderBody()}
                </div>
            </div>
        );
    }

    renderTitle() {
        if (this.state.title) {
            return <div className="modal-title">{this.state.title}</div>;
        }
        if (this.state.titleJsx) {
            return <div className="modal-title">{this.state.titleJsx}</div>;
        }
    }

    renderBody() {
        if (this.state.body) {
            return <div className="modal-body">{this.nl2br(this.state.body)}</div>;
        }
        if (this.state.bodyJsx) {
            return <div className="modal-body">{this.state.bodyJsx}</div>;
        }
    }

    nl2br(input) {

        return input.split('\n').map(function(item: string, i: number) {
            if (UrlValidation.isURL(item)) {
                return <span key={i}><a href={item} target="_blank">{item}</a><br /></span>;
            }

            return <span key={i}>{item}<br /></span>;
        });
    }

    close() {
        this.setState({
            visible: false
        });
    }

    open(args) {

        const state = {
            visible: true
        };

        state['title'] = args['title'] ? args['title'] : null;
        state['titleJsx'] = args['titleJsx'] ? args['titleJsx'] : null;
        state['body'] = args['body'] ? args['body'] : null;
        state['bodyJsx'] = args['bodyJsx'] ? args['bodyJsx'] : null;

        this.setState(state);
    }

    escFunction(event) {
        if (event.keyCode === 27) {
            this.close();
        }
    }

    componentDidMount() {
        this.escFunction = this.escFunction.bind(this);
        document.addEventListener('keydown', this.escFunction, false);
        Cache.ee.addListener('alert', this.open);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.escFunction, false);
        Cache.ee.removeListener('alert', this.open);
    }
}

export default translate('common')(Alert);

