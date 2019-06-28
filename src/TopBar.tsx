import * as React from 'react';
require('./css/topbar.css');
import { translate, Trans } from 'react-i18next';
import Cache from './lib/Cache';
import ViewSymbolsIcon from '@material-ui/icons/ViewModule';
import ViewListIcon from '@material-ui/icons/ViewList';
import LogoutIcon from '@material-ui/icons/ExitToApp';

interface IState {
    logoutButtonIsVisible: boolean;
}

class TopBar extends React.Component<{}, IState> {

    constructor(props) {

        super(props);

        this.state = {
            logoutButtonIsVisible: false
        };

        this.tokenReceived = this.tokenReceived.bind(this);
    }

    render() {

        return <div id="topbar">
            <div className="icon-button" onClick={() => this.showIconView()}>
                <ViewSymbolsIcon />
                <Trans i18nKey="iconView" />
            </div>
            <div className="icon-button" onClick={() => this.showListView()}>
                <ViewListIcon />
                <Trans i18nKey="listView" />
            </div>
            {this.renderLogin()}
        </div>;
    }

    renderLogin() {
        if (this.state.logoutButtonIsVisible) {
            return <div className="icon-button" onClick={() => this.logout()}>
                <LogoutIcon />
                <Trans i18nKey="logout" />
            </div>;
        }
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
