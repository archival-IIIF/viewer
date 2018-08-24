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
            error: false,
            errorMessage: ""
        };
    }

    render() {
        if (this.state.visible === false) {
            return ""
        }

        let error = "";
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

        let origin = window.location.protocol+'//'+window.location.hostname+(window.location.port ? ':'+window.location.port: '');
        let url = id + "?origin=" + origin;

        let t = this;
        let win = window.open(url);
        this.checkIfLoginWindowIsClosedInterval = window.setInterval(function() {
            try {
                if (win == null || win.closed) {
                    window.clearInterval(t.checkIfLoginWindowIsClosedInterval);
                    window.addEventListener("message", t.receiveToken);
                    document.getElementById('messageFrame').src = t.tokenUrl + '?messageId=1&origin=' + origin;
                    window.removeListener("message", t.receiveToken);
                }
            }
            catch (e) {
            }
        }, 1000);
    }

    closeModal(service) {
        window.clearInterval(this.checkIfLoginWindowIsClosedInterval);
        this.setState({
            visible: false
        })
    }

    logoutUrl = "";
    tokenUrl = "";

    showLogin(service) {
        if (service.service.hasOwnProperty("@id")) {
            this.tokenUrl = service.service["@id"]
        } else if (Array.isArray(service.service)) {
            for (let i in service.service) {
                let iService = service.service[i];
                if (iService.hasOwnProperty("@id") && iService.hasOwnProperty("profile") && iService["profile"] === "http://iiif.io/api/auth/1/token" && this.tokenUrl === "") {
                    this.tokenUrl = iService["@id"];
                    continue;
                }

                if (iService.hasOwnProperty("@id") && iService.hasOwnProperty("profile") && iService["profile"] === "http://iiif.io/api/auth/1/logout" && this.logoutUrl === "") {
                    this.logoutUrl = iService["@id"];
                }
            }
        }

        this.setState({
            visible: true,
            id: service["@id"],
            header: service.header,
            description: service.description,
            confirmLabel: service.confirmLabel,
            error: false,
            errorMessage: service.failureDescription
        })
    }


    showLogin = this.showLogin.bind(this);
    receiveToken = this.receiveToken.bind(this);

    componentDidMount() {
        global.ee.addListener('show-login', this.showLogin);
    }

    componentWillUnmount() {
        global.ee.removeListener('show-login', this.showLogin);
    }



    receiveToken(event) {

        if (!event.data.hasOwnProperty('error')) {
            this.setState({
                error: true
            });
            return;
        }

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