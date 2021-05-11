import * as React from 'react';
import Cache from '../lib/Cache';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import NavBarIcon from '@material-ui/icons/VerticalSplit';
import LanguageSwitcher from './LanguageSwitcher';
import {Translation} from 'react-i18next';
import './topbar.css';
import Token from "../lib/Token";
import ExternalSearch from "./ExternalSearch";
import {isSingleManifest} from "../lib/ManifestHelpers";
import {useContext} from "react";
import {AppContext} from "../AppContext";

export default function TopBar() {

    const {currentManifest} = useContext(AppContext);

    let bar = 'navBar';
    if (currentManifest && isSingleManifest(currentManifest)) {
        bar = 'infoBar';
    }

    return <div className="aiiif-topbar">
        <div className="aiiif-icon-button" onClick={() => Cache.ee.emit('toggle-splitter-main')}>
            <NavBarIcon />
            <Translation ns="common">{(t, { i18n }) => <p>{t(bar)}</p>}</Translation>
        </div>
        <LanguageSwitcher />
        <ExternalSearch />
        {Token.hasActiveToken() &&
            <div className="aiiif-icon-button" onClick={() => Token.logout()}>
                <LogoutIcon />
                <Translation ns="common">{(t, { i18n }) => <p>{t('logout')}</p>}</Translation>
            </div>
        }
    </div>;
}
