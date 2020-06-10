import * as React from 'react';
import Cache from '../lib/Cache';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import NavBarIcon from '@material-ui/icons/VerticalSplit';
import LanguageSwitcher from './LanguageSwitcher';
import {Translation} from 'react-i18next';
import './topbar.css';
import Token from "../lib/Token";

interface IState {
    logoutButtonIsVisible: boolean;
}

class TopBar extends React.Component<{}, IState> {

    constructor(props: {}) {

        super(props);

        this.state = {
            logoutButtonIsVisible: Token.has()
        };

        this.tokenReceived = this.tokenReceived.bind(this);
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

        if (this.state.logoutButtonIsVisible) {
            return <div className="icon-button" onClick={() => this.logout()}>
                <LogoutIcon />
                <Translation ns="common">{(t, { i18n }) => <p>{t('logout')}</p>}</Translation>
            </div>;
        }
    }

    logout() {
        Cache.ee.emit('logout');
    }

    toggleTreeViewBar() {
        Cache.ee.emit('toggle-splitter-main');
    }

    tokenReceived() {
        this.setState({
            logoutButtonIsVisible: Token.has()
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
