import React from 'react';
import SearchIcon from "@material-ui/icons/Search";
import {Translation} from "react-i18next";
import Config from "../lib/Config";

declare let global: {
    config: Config;
};

export default function ExternalSearch() {

    const externalSearchUrl = global.config.getExternalSearchUrl();
    if (!externalSearchUrl) {
        return <></>
    }

    return <a className="icon-button" href={externalSearchUrl}>
        <SearchIcon />
        <Translation ns="common">{(t, { i18n }) => <p>{t('search')}</p>}</Translation>
    </a>
}
