import Modal from './Modal';
import React from 'react';
import Manifest from './lib/Manifest';
import InfoJson from './lib/InfoJson';
import manifesto from "manifesto.js";

class Login extends Modal {

    constructor(props) {

        super(props);

        this.state = {
            visible: false,
        };
    }

    button1() {
        return <div className="modal-button" onClick={() => this.openWindow(this.state.id)}>{this.state.confirmLabel}</div>
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
        super.closeModal();
    }

    logoutUrl = '';
    tokenUrl = '';

    showLogin(manifestoData) {

        const loginService = manifesto.Utils.getService(manifestoData, 'http://iiif.io/api/auth/1/login');
        if (!loginService.options) {
            loginService.options = {locale: Manifest.lang};
        }

        if (loginService !== false) {
            this.getTokenUrlFromService(loginService);

            this.setState({
                visible: true,
                id: loginService.id,
                title: loginService.getHeader(),
                description: loginService.getDescription(),
                confirmLabel: loginService.getConfirmLabel(),
                error: false,
                errorMessage: loginService.getFailureDescription()
            });
        }

    }

    body() {
        let body = [];
        body.push(<iframe id="messageFrame" title="messageFrame" key="messageFrame" />);
        body.push(<div key="description">{this.state.description}</div>);

        if (this.state.error) {
            body.push(<div id="modal-error-message" key="error">{this.state.errorMessage}</div>)
        }

        return body;
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
        let id = Manifest.getIdFromCurrentUrl();
        let currentUrl = window.location.href;
        let viewerUrl = currentUrl.substring(0, currentUrl.indexOf('?manifest='));
        window.location.href = viewerUrl + '?manifest=' + id;
    }

    showLogin = this.showLogin.bind(this);
    logout = this.logout.bind(this);
    receiveToken = this.receiveToken.bind(this);

    componentDidMount() {
        super.componentDidMount();

        global.ee.addListener('show-login', this.showLogin);
        global.ee.addListener('logout', this.logout);
    }

    componentWillUnmount() {
        super.componentWillUnmount();

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
        InfoJson.clearCache();
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