import * as React from 'react';
import Cache from '../lib/Cache';
import ViewSymbolsIcon from '@material-ui/icons/ViewComfy';
import ViewListIcon from '@material-ui/icons/ViewList';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import NavBarIcon from '@material-ui/icons/VerticalSplit';
import LanguageSwitcher from './LanguageSwitcher';
import {Translation, useTranslation} from 'react-i18next';

require('./topbar.css');

interface IState {
    logoutButtonIsVisible: boolean;
}

class TopBar extends React.Component<any, IState> {

    constructor(props: any) {

        super(props);

        this.state = {
            logoutButtonIsVisible: false
        };

        this.tokenReceived = this.tokenReceived.bind(this);
    }

    render() {

        return <div id="topbar">
            <div className="icon-button" onClick={() => this.toggleNavigationBar()}>
                <NavBarIcon />
                <Translation ns="common">{(t, { i18n }) => <p>{t('navBar')}</p>}</Translation>
            </div>
            <div className="icon-button" onClick={() => this.showIconView()}>
                <ViewSymbolsIcon />
                <Translation ns="common">{(t, { i18n }) => <p>{t('iconView')}</p>}</Translation>
            </div>
            <div className="icon-button" onClick={() => this.showListView()}>
                <ViewListIcon />
                <Translation ns="common">{(t, { i18n }) => <p>{t('listView')}</p>}</Translation>
            </div>
            <LanguageSwitcher />

            {this.renderLogin()}
        </div>;
    }

    renderLogin() {

        if (this.state.logoutButtonIsVisible) {
            return <div className="icon-button" onClick={() => this.logout()}>
                <LogoutIcon />
                <Translation ns="common">{(t, { i18n }) => <p>{t('logout')}</p>}</Translation>
            </div>;
        }
    }


    showListView() {
        Cache.ee.emit('show-list-view');
    }

    logout() {
        Cache.ee.emit('logout');
    }

    toggleNavigationBar() {
        Cache.ee.emit('toggle-nav-bar');
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

export default TopBar;
