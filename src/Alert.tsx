import * as React from 'react';
import Cache from './lib/Cache';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Nl2br from './viewer/Nl2br';
import './css/modal.css';

interface IState {
    visible: boolean;
    title?: string;
    titleJsx?: JSX.Element;
    body?: string;
    bodyJsx?: JSX.Element;
}

class Alert extends React.Component<any, IState> {

    constructor(props: any) {
        super(props);

        this.state = {
            visible: false
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    render() {


        return <Dialog
            open={this.state.visible}
            onClose={this.close}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
        >
            <DialogTitle >
                {this.renderTitle()}
                <span className="close" onClick={this.close}>&times;</span>
            </DialogTitle>
            <DialogContent>
                <DialogContentText color="textPrimary" component="div">
                    {this.renderBody()}
                </DialogContentText>
            </DialogContent>
        </Dialog>;

    }

    renderTitle() {
        if (this.state.title) {
            return this.state.title;
        }
        if (this.state.titleJsx) {
            return this.state.titleJsx;
        }
    }

    renderBody() {
        if (this.state.body) {
            return <Nl2br text={this.state.body} urlTransformation={true}/>;
        }
        if (this.state.bodyJsx) {
            return this.state.bodyJsx;
        }
    }

    close() {
        this.setState({
            visible: false
        });
    }

    open(args: any) {

        const state: any = {
            visible: true
        };

        state['title'] = args['title'] ? args['title'] : null;
        state['titleJsx'] = args['titleJsx'] ? args['titleJsx'] : null;
        state['body'] = args['body'] ? args['body'] : null;
        state['bodyJsx'] = args['bodyJsx'] ? args['bodyJsx'] : null;

        this.setState(state);
    }

    componentDidMount() {
        Cache.ee.addListener('alert', this.open);
    }

    componentWillUnmount() {
        Cache.ee.removeListener('alert', this.open);
    }
}

export default Alert;
