import * as React from 'react';
import Cache from '../lib/Cache';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import NavBarIcon from '@material-ui/icons/VerticalSplit';
import LanguageSwitcher from './LanguageSwitcher';
import {Translation} from 'react-i18next';
import './topbar.css';
import Token from "../lib/Token";
import logout from "../lib/Logout";

class TopBar extends React.Component<{}, {}> {

    constructor(props: {}) {
        super(props);
        this.toggleTreeViewBar = this.toggleTreeViewBar.bind(this);
    }

    render() {

        return <div id="topbar">
            <div className="icon-button" onClick={this.toggleTreeViewBar}>
                <NavBarIcon />
                <Translation ns="common">{(t, { i18n }) => <p>{t('navBar')}</p>}</Translation>
            </div>
            <LanguageSwitcher />

            {this.renderLogin()}
        </div>;
    }

    renderLogin() {
        if (Token.hasActiveToken()) {
            return <div className="icon-button" onClick={() => logout()}>
                <LogoutIcon />
                <Translation ns="common">{(t, { i18n }) => <p>{t('logout')}</p>}</Translation>
            </div>;
        }
    }

    toggleTreeViewBar() {
        Cache.ee.emit('toggle-splitter-main');
    }
}

export default TopBar;
