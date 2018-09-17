import React from 'react';
import './css/topbar.css';
import { translate, Trans } from 'react-i18next';

class TopBar extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            logoutButtonIsVisible: false
        };
    }

    render() {

        let login = '';
        if (this.state.logoutButtonIsVisible) {
            login = <span id="logout-button" onClick={() => this.logout()}><Trans i18nKey="logout" /></span>
        }

        return <div id="topbar">
            <span id="show-icon-view-button" onClick={() => this.showIconView()}>
                <Trans i18nKey='iconView' />
            </span>&nbsp;
            <span id="show-list-view-button" onClick={() => this.showListView()}>
                <Trans i18nKey='listView' />
            </span>
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

export default translate('common')(TopBar);