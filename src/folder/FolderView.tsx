import * as React from 'react';
import Item from './Item';
import {Translation} from 'react-i18next';
import {getLocalized} from "../lib/ManifestHelpers";
import {useContext, useState} from "react";
import {AppContext} from "../AppContext";
import {InputBase} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faTh, faThList} from "@fortawesome/free-solid-svg-icons";
import removeDiacritics from "../lib/Diacritics";
import i18next from "i18next";

export default function FolderView() {

    const {currentManifest, setCurrentManifest, authDate, currentFolder} = useContext(AppContext);
    const [mode, setMode] = useState<string>('icon-view');
    const [search, setSearch] = useState<string>('');
    if (!currentManifest || !currentFolder) {
        return  <></>;
    }

    if (currentFolder.restricted) {
        return <div className="aiiif-folder-view-container" />;
    }

    const files = currentFolder.manifests;
    const folders = currentFolder.collections;
    const content: JSX.Element[] = [];

    if (files.length === 0 && folders.length === 0) {

        content.push(<div className="aiiif-empty" key="empty">
            <Translation ns="common">{(t, { i18n }) => <p>{t('emptyFolder')}</p>}</Translation>
        </div>);
    } else {
        const s = removeDiacritics(search);
        for (const folder of folders) {
            if (search === '' || removeDiacritics(getLocalized(folder.label)).includes(s)) {
                content.push(
                    <Item
                        item={folder}
                        selected={currentManifest}
                        key={folder.id}
                        setCurrentManifest={setCurrentManifest}
                        authDate={authDate}
                    />
                );
            }
        }
        for (const file of files) {
            if (search === '' || removeDiacritics(getLocalized(file.label)).includes(s)) {
                content.push(
                    <Item
                        item={file}
                        selected={currentManifest}
                        key={file.id}
                        setCurrentManifest={setCurrentManifest}
                        authDate={authDate}
                    />
                );
            }
        }
    }


    const folderViewClassNames = 'aiiif-folder-view aiiif-' + mode;

    return (
        <div className="aiiif-folder-view-container">
            <nav className="aiiif-bar">
                <div className="aiiif-bar-search">
                    <div className="">
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <InputBase
                        placeholder={i18next.t('common:searchInputLabel')}
                        inputProps={{ 'aria-label': 'search' }}
                        type="search"
                        value={search}
                        onChange={e => setSearch(e.currentTarget.value)}
                    />
                </div>
                <div className="aiiif-icon-button" onClick={() => setMode('icon-view')}>
                    <FontAwesomeIcon icon={faTh} />
                    <Translation ns="common">{(t, { i18n }) => <p>{t('iconView')}</p>}</Translation>
                </div>
                <div className="aiiif-icon-button" onClick={() => setMode('list-view')}>
                    <FontAwesomeIcon icon={faThList} />
                    <Translation ns="common">{(t, { i18n }) => <p>{t('listView')}</p>}</Translation>
                </div>
            </nav>
            <div>
                <h1>{getLocalized(currentFolder.label)}</h1>
                <div className={folderViewClassNames}>{content}</div>
            </div>

        </div>
    );
}
