import React from "react";
import './css/modal.css';
import Manifest from "./lib/Manifest";

class Login extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            id: "",
            header: "",
            description: "",
            confirmLabel: "",
            visible: false,
            tokenUrl: null
        };
    }

    render() {
        if (this.state.visible === false) {
            return ""
        }

        return (
            <div id="login" className="modal">
                <iframe id="messageFrame" title="messageFrame" />
                <div className="modal-content">
                    <span className="close">&times;</span>

                    <div className="title">{this.state.header}</div>

                    <div>{this.state.description}</div>

                    <div id="login-button" onClick={() => this.openWindow(this.state.id, this.state.tokenUrl)}>{this.state.confirmLabel}</div>
                </div>
            </div>
        );
    }

    openWindow(id, tokenUrl) {

        let origin = window.location.protocol+'//'+window.location.hostname+(window.location.port ? ':'+window.location.port: '');
        let url = id + "?origin=" + origin;

        let win = window.open(url);
        let interval = window.setInterval(function() {
            try {
                if (win == null || win.closed) {
                    window.clearInterval(interval);
                    document.getElementById('messageFrame').src = tokenUrl + '?messageId=1&origin=' + origin;

                }
            }
            catch (e) {
            }
        }, 1000);
    }


    showLogin(service) {

        this.setState({
            visible: true,
            id: service["@id"],
            header: service.header,
            description: service.description,
            confirmLabel: service.confirmLabel,
            tokenUrl: service.service["@id"]
        })
    }


    showLogin = this.showLogin.bind(this);
    receiveToken = this.receiveToken.bind(this);

    componentDidMount() {
        window.addEventListener("message", this.receiveToken);
        global.ee.addListener('show-login', this.showLogin);
    }

    componentWillUnmount() {
        window.removeListener("message", this.receiveToken.bind(this));
        global.ee.removeListener('show-login', this.showLogin);
    }



    receiveToken(event) {

        if (!event.data.hasOwnProperty('accessToken')) {
            return;
        }

        let token = event.data.accessToken;
        global.token = token;
        let id = Manifest.getIdFromCurrentUrl();
        global.ee.emitEvent('open-folder', [id]);

        this.setState({
            visible: false
        })
    }



}

export default Login;