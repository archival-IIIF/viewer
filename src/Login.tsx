import * as React from 'react';
import Manifest from './lib/Manifest';
import InfoJson from './lib/InfoJson';
import Cache from './lib/Cache';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Token from "./lib/Token";
import {ServiceProfile} from "@iiif/vocabulary/dist-commonjs";
import * as DOMPurify from "dompurify";
import Config from "./lib/Config";
import {IAuthService} from "./interface/IManifestData";

interface IState {
    visible: boolean;
    manifestations?: any;
    error?: boolean;
}

declare let global: {
    config: Config;
};

interface IProps {
    setCurrentManifest: (id?: string) => void;
}

class Login extends React.Component<IProps, IState> {

    private checkIfLoginWindowIsClosedInterval = 0;
    private origin = window.location.protocol + '//' + window.location.hostname
        + (window.location.port ? ':' + window.location.port : '');
    private openWindows: string[] = [];

    constructor(props: IProps) {

        super(props);

        this.state = {visible: false};

        this.showLogin = this.showLogin.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.receiveToken = this.receiveToken.bind(this);
    }

    private authService?: IAuthService = undefined;

    render() {
        if (!this.authService) {
            return <></>
        }

        const authService = this.authService;

        return <>
            <iframe id="messageFrame" title="messageFrame" />
            <Dialog
                id={authService.id}
                open={this.state.visible}
                onClose={this.closeModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle >
                    {authService.header}
                    <span className="close" onClick={this.closeModal}>&times;</span>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText color="textPrimary" component="div">
                        {this.body(authService)}
                    </DialogContentText>
                    <DialogActions>
                        <Button onClick={() => this.openWindow(authService.id)} color="primary">
                            {authService.confirmLabel}
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </>;
    }

    openWindow(id: string) {

        if (!this.authService || !this.authService.token) {
            return;
        }
        const token = this.authService.token;

        const url = id + '?origin=' + this.origin;
        if (this.openWindows.includes(id)) {
            return;
        }
        this.openWindows.push(id);

        const win = window.open(url);
        this.checkIfLoginWindowIsClosedInterval = window.setInterval(() => {
            try {
                if (win === null || win.closed) {
                    window.clearInterval(this.checkIfLoginWindowIsClosedInterval);
                    window.addEventListener(
                        'message',
                        (event) => this.receiveToken(event, id), {once: true}
                        );
                    const src = token + '?messageId=1&origin=' + this.origin;
                    const messageFrame: any = document.getElementById('messageFrame');
                    if (messageFrame) {
                        messageFrame.src = src;
                    }
                }
            } catch (e) {
            }

        }, 1000);
    }

    closeModal() {
        this.setState({
            visible: false
        });
    }

    escFunction(event: any) {
        if (event.keyCode === 27) {
            this.closeModal();
        }
    }

    showLogin(authService: IAuthService) {

        this.authService = authService;
        if (authService.profile === ServiceProfile.AUTH_1_KIOSK) {
            this.openWindow(authService.id);
            return;
        }
        /*if (!authService.options) {
            authService['options'] = {locale: Manifest.lang};
        }*/

        if (!this.state.visible) {
            this.setState({
                error: false,
                visible: true,
            });
        }
    }

    body(authService: IAuthService) {
        const body = [];
        body.push(<div key="description" dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
            __html: DOMPurify.sanitize(authService.description ?? '', global.config.getSanitizeRulesSet())
        }} />);


        if (this.state.error) {
            body.push(<div className="modal-error-message" key="error">{authService.errorMessage}</div>);
        }

        return body;
    }

    componentDidMount() {
        this.escFunction = this.escFunction.bind(this);
        document.addEventListener('keydown', this.escFunction, false);

        Cache.ee.addListener('show-login', this.showLogin);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.escFunction, false);

        Cache.ee.removeListener('show-login', this.showLogin);
    }

    receiveToken(event: any, id: string) {

        if (!this.authService || !this.authService.token) {
            return;
        }

        const index = this.openWindows.indexOf(id);
        if (index > -1) {
            this.openWindows.splice(index, 1);
        }

        if (!event.data.hasOwnProperty('accessToken') || event.data.hasOwnProperty('error')) {
            this.setState({
                error: true
            });
            return;
        }
        Manifest.clearCache();
        InfoJson.clearCache();
        Token.set(event.data, this.authService.token);
        Cache.ee.emit('token-received');
        this.props.setCurrentManifest();

        this.setState({
            visible: false
        });
    }
}

export default Login;
