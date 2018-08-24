import React from "react";
import './css/topbar.css';

class TopBar extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            logoutButtonIsVisible: false
        };
    }

    render() {

        let login = "";
        if (this.state.logoutButtonIsVisible) {
            login = <span id="logout-button" onClick={() => this.logout()}>Logout</span>
        }

        return <div id="topbar">
            <span id="show-icon-view-button" onClick={() => this.showIconView()}>Icon view</span>&nbsp;
            <span id="show-list-view-button" onClick={() => this.showListView()}>List view</span>
            {login}
        </div>
    }


    showListView() {
        global.ee.emitEvent('show-list-view');
    }

    logout() {
        global.ee.emitEvent('logout');
    }

    showIconView() {
        global.ee.emitEvent('show-icon-view');
    }


    tokenReceived() {
        this.setState({
            logoutButtonIsVisible: true
        })
    }


    tokenReceived = this.tokenReceived.bind(this);

    componentDidMount() {
        global.ee.addListener('token-received', this.tokenReceived);
    }

    componentWillUnmount() {
        global.ee.removeListener('token-received', this.tokenReceived);
    }

}

export default TopBar;
