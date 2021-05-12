import React from 'react';
import {Translation} from "react-i18next";
import Config from "../lib/Config";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

declare let global: {
    config: Config;
};

export default function ExternalSearch() {

    const externalSearchUrl = global.config.getExternalSearchUrl();
    if (!externalSearchUrl) {
        return <></>
    }

    return <a className="aiiif-icon-button" href={externalSearchUrl}>
        <FontAwesomeIcon icon={faSearch} />
        <Translation ns="common">{(t, { i18n }) => <p>{t('search')}</p>}</Translation>
    </a>
}
