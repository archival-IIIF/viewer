import React from 'react';
import './css/modal.css';
import Manifest from './lib/Manifest';
import InfoJson from './lib/InfoJson';

class Login extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            id: '',
            header: '',
            description: '',
            confirmLabel: '',
            visible: false,
            error: false,
            errorMessage: ''
        };
    }

    render() {
        if (this.state.visible === false) {
            return ''
        }

        let error = '';
        if (this.state.error) {
            error = <div id="modal-error-message">{this.state.errorMessage}</div>
        }

        return (
            <div id="login" className="modal">
                <iframe id="messageFrame" title="messageFrame" />
                <div className="modal-content">
                    <span className="close"  onClick={() => this.closeModal()}>&times;</span>

                    <div className="title">{this.state.header}</div>

                    <div>{this.state.description}</div>

                    {error}

                    <div id="login-button" onClick={() => this.openWindow(this.state.id)}>{this.state.confirmLabel}</div>
                </div>
            </div>
        );
    }

    checkIfLoginWindowIsClosedInterval = null;

    openWindow(id) {

        let url = id + '?origin=' + this.origin;

        let t = this;
        let win = window.open(url);
        this.checkIfLoginWindowIsClosedInterval = window.setInterval(function() {
            try {
                if (win == null || win.closed) {
                    window.clearInterval(t.checkIfLoginWindowIsClosedInterval);
                    window.addEventListener('message', t.receiveToken);
                    document.getElementById('messageFrame').src = t.tokenUrl + '?messageId=1&origin=' + t.origin;
                    window.removeListener('message', t.receiveToken);
                }
            }
            catch (e) {
            }
        }, 1000);
    }

    origin = window.location.protocol+'//'+window.location.hostname+(window.location.port ? ':'+window.location.port: '');

    closeModal(service) {
        window.clearInterval(this.checkIfLoginWindowIsClosedInterval);
        this.setState({
            visible: false
        })
    }

    logoutUrl = '';
    tokenUrl = '';

    showLogin(manifestoData) {

        const loginService = manifestoData.getService('http://iiif.io/api/auth/1/login');
        if (loginService !== false) {
            this.getTokenUrlFromService(loginService);

            this.setState({
                visible: true,
                id: loginService.id,
                header: loginService.getHeader(),
                description: loginService.getDescription(),
                confirmLabel: loginService.getConfirmLabel(),
                error: false,
                errorMessage: loginService.getFailureDescription()
            });
        }

    }

    getTokenUrlFromService(loginService) {
        const tokenService = loginService.getService('http://iiif.io/api/auth/1/token');
        this.tokenUrl = tokenService.id;

        const logoutService = loginService.getService('http://iiif.io/api/auth/1/logout');
        this.logoutUrl = logoutService.id;
    }

    getExternal(service) {


        if (service.hasOwnProperty('profile') ) {

            if (service.profile !== 'http://iiif.io/api/auth/1/external') {
                return false;
            }

            return service;
        }

        if (service.hasOwnProperty(0)) {
            let i;
            for (i = 0; i < service.length; i++) {
                let iService = service[i];

                if (iService.hasOwnProperty('profile') && iService.profile === 'http://iiif.io/api/auth/1/external') {
                    return iService
                }
            }
        }

        return false;
    }


    logout() {
        window.open(this.logoutUrl, '_blank');
        global.token = '';
        Manifest.clearCache();
        InfoJson.clearCache();
        global.ee.emitEvent('logout-done');
        let id = Manifest.getIdFromCurrentUrl();
        global.ee.emitEvent('open-folder', [id]);
    }

    showLogin = this.showLogin.bind(this);
    logout = this.logout.bind(this);
    receiveToken = this.receiveToken.bind(this);

    componentDidMount() {
        global.ee.addListener('show-login', this.showLogin);
        global.ee.addListener('logout', this.logout);
    }

    componentWillUnmount() {
        global.ee.removeListener('show-login', this.showLogin);
        global.ee.removeListener('logout', this.logout);
    }



    receiveToken(event) {

        if (!event.data.hasOwnProperty('accessToken') || event.data.hasOwnProperty('error')) {
            this.setState({
                error: true
            });
            return;
        }
        Manifest.clearCache();
        let token = event.data.accessToken;
        global.token = token;
        global.ee.emitEvent('token-received');
        let id = Manifest.getIdFromCurrentUrl();
        global.ee.emitEvent('open-folder', [id]);

        this.setState({
            visible: false
        })
    }



}

export default Login;