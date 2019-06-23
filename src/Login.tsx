import * as React from 'react';
import Manifest from './lib/Manifest';
import InfoJson from './lib/InfoJson';
import Cache from './lib/Cache';

const manifesto = require('manifesto.js');

interface IState {
    visible?: boolean;
    id?: string;
    title?: JSX.Element;
    confirmLabel?: string;
    manifestations?: any;
    description?: string;
    error?: boolean;
    errorMessage?: string;
}

class Login extends React.Component<{}, IState> {

    private checkIfLoginWindowIsClosedInterval = null;
    private logoutUrl = '';
    private tokenUrl = '';
    private origin = window.location.protocol + '//' + window.location.hostname
        + (window.location.port ? ':' + window.location.port : '');

    constructor(props) {

        super(props);

        this.state = {
            visible: false,
        };

        this.showLogin = this.showLogin.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.logout = this.logout.bind(this);
        this.receiveToken = this.receiveToken.bind(this);
    }

    render() {

        if (!this.state.visible) {
            return '';
        }

        return (
            <div id={this.state.id} className="modal">
                <div className="modal-content">
                    <span className="close"  onClick={this.closeModal}>&times;</span>
                    <div className="modal-title">{this.state.title}</div>
                    {this.body()}
                    <div className="modal-button" onClick={() => this.openWindow(this.state.id)}>
                        {this.state.confirmLabel}
                    </div>
                </div>
            </div>
        );
    }

    openWindow(id) {

        const url = id + '?origin=' + this.origin;

        const win = window.open(url);
        this.checkIfLoginWindowIsClosedInterval = window.setInterval(() => {
            try {
                if (win == null || win.closed) {
                    window.clearInterval(this.checkIfLoginWindowIsClosedInterval);
                    window.addEventListener('message', (event) => this.receiveToken(event), {once: true});
                    const src = this.tokenUrl + '?messageId=1&origin=' + this.origin;
                    document.getElementById('messageFrame')['src'] = src;
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

    escFunction(event) {
        if (event.keyCode === 27) {
            this.closeModal();
        }
    }

    showLogin(manifestoData) {

        const loginService = manifesto.Utils.getService(manifestoData, 'http://iiif.io/api/auth/1/login');
        if (!loginService.options) {
            loginService['options'] = {locale: Manifest.lang};
        }

        if (loginService !== false) {
            this.getTokenUrlFromService(loginService);

            this.setState({
                confirmLabel: loginService.getConfirmLabel(),
                description: loginService.getDescription(),
                error: false,
                errorMessage: loginService.getFailureDescription(),
                id: loginService.id,
                title: loginService.getHeader(),
                visible: true
            });
        }

    }

    body() {
        const body = [];
        body.push(<iframe id="messageFrame" title="messageFrame" key="messageFrame"/>);
        body.push(<div key="description">{this.state.description}</div>);

        if (this.state.error) {
            body.push(<div id="modal-error-message" key="error">{this.state.errorMessage}</div>);
        }

        return body;
    }

    getTokenUrlFromService(loginService) {
        const tokenService = loginService.getService('http://iiif.io/api/auth/1/token');
        this.tokenUrl = tokenService.id;

        const logoutService = loginService.getService('http://iiif.io/api/auth/1/logout');
        this.logoutUrl = logoutService.id;
    }

    logout() {
        window.open(this.logoutUrl, '_blank');
        const id = Manifest.getIdFromCurrentUrl();
        const currentUrl = window.location.href;
        const viewerUrl = currentUrl.substring(0, currentUrl.indexOf('?manifest='));
        window.location.href = viewerUrl + '?manifest=' + id;
    }

    componentDidMount() {
        this.escFunction = this.escFunction.bind(this);
        document.addEventListener('keydown', this.escFunction, false);

        Cache.ee.addListener('show-login', this.showLogin);
        Cache.ee.addListener('logout', this.logout);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.escFunction, false);

        Cache.ee.removeListener('show-login', this.showLogin);
        Cache.ee.removeListener('logout', this.logout);
    }

    receiveToken(event) {

        if (!event.data.hasOwnProperty('accessToken') || event.data.hasOwnProperty('error')) {
            this.setState({
                error: true
            });
            return;
        }
        Manifest.clearCache();
        InfoJson.clearCache();
        Cache.token = event.data.accessToken;
        Cache.ee.emit('token-received');
        const id = Manifest.getIdFromCurrentUrl();
        Cache.ee.emit('open-folder', id);

        this.setState({
            visible: false
        });
    }
}

export default Login;
