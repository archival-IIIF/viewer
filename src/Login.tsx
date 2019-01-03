import Modal from './Modal';
import * as React from 'react';
import Manifest from './lib/Manifest';
import InfoJson from './lib/InfoJson';
import Cache from './lib/Cache';

const manifesto = require('manifesto.js');

class Login extends Modal {

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
        this.logout = this.logout.bind(this);
        this.receiveToken = this.receiveToken.bind(this);
    }

    button1() {
        return <div className="modal-button" onClick={() => this.openWindow(this.state.id)}>
            {this.state.confirmLabel}
        </div>;
    }

    openWindow(id) {

        const url = id + '?origin=' + this.origin;

        const t = this;
        const win = window.open(url);
        this.checkIfLoginWindowIsClosedInterval = window.setInterval(function() {
            try {
                if (win == null || win.closed) {
                    window.clearInterval(t.checkIfLoginWindowIsClosedInterval);
                    window.addEventListener('message', t.receiveToken);
                    const src = t.tokenUrl + '?messageId=1&origin=' + t.origin;
                    document.getElementById('messageFrame')['src'] = src;
                    window.removeEventListener('message', t.receiveToken);
                }
            } catch (e) {
            }

        }, 1000);
    }

    closeModal(service) {
        window.clearInterval(this.checkIfLoginWindowIsClosedInterval);
        super.closeModal();
    }

    showLogin(manifestoData) {

        const loginService = manifesto.Utils.getService(manifestoData, 'http://iiif.io/api/auth/1/login');
        // ToDo
        /*
        if (!loginService.options) {
            loginService['options'] = {locale: Manifest.lang};
        }
        */

        // ToDo
        // if (loginService !== false) {
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
        // }

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

    getExternal(service) {


        if (service.hasOwnProperty('profile')) {

            if (service.profile !== 'http://iiif.io/api/auth/1/external') {
                return false;
            }

            return service;
        }

        if (service.hasOwnProperty(0)) {
            for (const iService of service) {
                if (iService.hasOwnProperty('profile') &&
                    iService.profile === 'http://iiif.io/api/auth/1/external') {
                    return iService;
                }
            }
        }

        return false;
    }


    logout() {
        window.open(this.logoutUrl, '_blank');
        const id = Manifest.getIdFromCurrentUrl();
        const currentUrl = window.location.href;
        const viewerUrl = currentUrl.substring(0, currentUrl.indexOf('?manifest='));
        window.location.href = viewerUrl + '?manifest=' + id;
    }


    componentDidMount() {
        super.componentDidMount();

        Cache.ee.addListener('show-login', this.showLogin);
        Cache.ee.addListener('logout', this.logout);
    }

    componentWillUnmount() {
        super.componentWillUnmount();

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
        Cache.ee.emitEvent('token-received');
        const id = Manifest.getIdFromCurrentUrl();
        Cache.ee.emitEvent('open-folder', [id]);

        this.setState({
            visible: false
        });
    }


}

export default Login;
