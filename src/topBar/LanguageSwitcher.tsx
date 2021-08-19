import * as React from 'react';
import { Translation } from 'react-i18next';
import LanguageIcon from '@material-ui/icons/Language';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Config from '../lib/Config';
import {ReactElement, useState} from 'react';
import i18n from 'i18next';

declare let global: {
    config: Config;
};

export default function LanguageSwitcher() {

    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

    if (global.config.getDisableLanguageSelection()) {
        return <></>;
    }

    const open = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const close = () => {
        setAnchorEl(null);
    }

    const changeLanguage = (code: string) => {
        i18n.changeLanguage(code);
        setAnchorEl(null);
    }

    const languages: ReactElement[] = [];
    const translations = global.config.getTranslations();
    for (const i in translations) {

        if (!translations.hasOwnProperty(i)) {
            continue;
        }

        languages.push(<MenuItem key={i} onClick={() => changeLanguage(i)}>{translations[i]}</MenuItem>);
    }

    return <>
        <div className="aiiif-icon-button" onClick={open} aria-controls="language-switch-menu"
             aria-haspopup="true">
            <LanguageIcon/>
            <Translation ns="common">{(t, { i18n }) => <p>{t('language')}</p>}</Translation>
        </div>
        <Menu
            className="aiiif-language-switch-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            keepMounted
            onClose={close}
        >
            {languages}
        </Menu>
    </>;
}


