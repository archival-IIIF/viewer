import * as React from 'react';
require('./css/topbar.css');
import { translate, Trans } from 'react-i18next';
import Cache from './lib/Cache';

class TopBar extends React.Component<{}, any> {

    constructor(props) {

        super(props);

        this.state = {
            logoutButtonIsVisible: false
        };

        this.tokenReceived = this.tokenReceived.bind(this);
    }

    render() {

        let login = <span />;
        if (this.state.logoutButtonIsVisible) {
            login = <span id="logout-button" onClick={() => this.logout()}><Trans i18nKey="logout" /></span>;
        }

        return <div id="topbar">
            <span id="show-icon-view-button" onClick={() => this.showIconView()}>
                <Trans i18nKey="iconView" />
            </span>&nbsp;
            <span id="show-list-view-button" onClick={() => this.showListView()}>
                <Trans i18nKey="listView" />
            </span>
            {login}
        </div>;
    }


    showListView() {
        Cache.ee.emit('show-list-view');
    }

    logout() {
        Cache.ee.emit('logout');
    }

    showIconView() {
        Cache.ee.emit('show-icon-view');
    }


    tokenReceived() {
        this.setState({
            logoutButtonIsVisible: true
        });
    }

    componentDidMount() {
        Cache.ee.addListener('token-received', this.tokenReceived);
    }

    componentWillUnmount() {
        Cache.ee.removeListener('token-received', this.tokenReceived);
    }

}

export default translate('common')(TopBar);
