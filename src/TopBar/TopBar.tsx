import * as React from 'react';
import Cache from '../lib/Cache';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import NavBarIcon from '@material-ui/icons/VerticalSplit';
import LanguageSwitcher from './LanguageSwitcher';
import {Translation} from 'react-i18next';
import './topbar.css';
import Token from "../lib/Token";
import IManifestData from "../interface/IManifestData";
import logout from "../lib/Logout";

interface IProps {
    currentManifest?: IManifestData;
}

class TopBar extends React.Component<IProps, {}> {

    constructor(props: IProps) {

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

        if (
            this.props.currentManifest &&
            this.props.currentManifest.authService &&
            this.props.currentManifest.authService.logout &&
            this.props.currentManifest.authService.token &&
            Token.has(this.props.currentManifest.authService.token)
        ) {
            return <div className="icon-button" onClick={() => this.handleLogout()}>
                <LogoutIcon />
                <Translation ns="common">{(t, { i18n }) => <p>{t('logout')}</p>}</Translation>
            </div>;
        }
    }

    handleLogout() {
        if (
            this.props.currentManifest &&
            this.props.currentManifest.authService &&
            this.props.currentManifest.authService.logout &&
            this.props.currentManifest.authService.token
        ) {
            logout(this.props.currentManifest.authService.token, this.props.currentManifest.authService.logout);
        }
    }

    toggleTreeViewBar() {
        Cache.ee.emit('toggle-splitter-main');
    }
}

export default TopBar;
