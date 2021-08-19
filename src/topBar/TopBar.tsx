import * as React from 'react';
import Cache from '../lib/Cache';
import NavBarIcon from '@material-ui/icons/VerticalSplit';
import LanguageSwitcher from './LanguageSwitcher';
import {Translation} from 'react-i18next';
import './topbar.css';
import Token from "../lib/Token";
import ExternalSearch from "./ExternalSearch";
import {isSingleManifest} from "../lib/ManifestHelpers";
import {useContext} from "react";
import {AppContext} from "../AppContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import Config from "../lib/Config";

declare let global: {
    config: Config;
};

export default function TopBar() {

    const {currentManifest} = useContext(AppContext);

    if (global.config.isEmbedded()) {
        return <></>;
    }

    return <div className="aiiif-topbar">
        {(currentManifest && !isSingleManifest(currentManifest)) &&
            <div className="aiiif-icon-button" onClick={() => Cache.ee.emit('toggle-splitter-main')}>
                <NavBarIcon />
                <Translation ns="common">{(t, { i18n }) => <p>{t('navBar')}</p>}</Translation>
            </div>
        }
        <LanguageSwitcher />
        <ExternalSearch />
        {Token.hasActiveToken() &&
            <div className="aiiif-icon-button" onClick={() => Token.logout()}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                <Translation ns="common">{(t, { i18n }) => <p>{t('logout')}</p>}</Translation>
            </div>
        }
    </div>;
}
