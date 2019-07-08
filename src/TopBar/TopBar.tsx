import * as React from 'react';
import Cache from '../lib/Cache';
import ViewSymbolsIcon from '@material-ui/icons/ViewComfy';
import ViewListIcon from '@material-ui/icons/ViewList';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import NavBarIcon from '@material-ui/icons/VerticalSplit';
import LanguageSwitcher from './LanguageSwitcher';
import {useTranslation} from 'react-i18next';

require('./topbar.css');

interface IState {
    logoutButtonIsVisible: boolean;
}

const {t} = useTranslation('common');

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
                {t('navBar')}
            </div>
            <div className="icon-button" onClick={() => this.showIconView()}>
                <ViewSymbolsIcon />
                {t('iconView')}
            </div>
            <div className="icon-button" onClick={() => this.showListView()}>
                <ViewListIcon />
                {t('listView')}
            </div>
            <LanguageSwitcher />

            {this.renderLogin()}
        </div>;
    }

    renderLogin() {

        if (this.state.logoutButtonIsVisible) {
            return <div className="icon-button" onClick={() => this.logout()}>
                <LogoutIcon />
                {t('logout')}
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
