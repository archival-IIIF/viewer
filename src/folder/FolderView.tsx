import * as React from 'react';
import Item from './Item';
import {Translation} from 'react-i18next';
import ViewSymbolsIcon from "@material-ui/icons/ViewComfy";
import ViewListIcon from "@material-ui/icons/ViewList";
import {getLocalized} from "../lib/ManifestHelpers";
import {useContext, useState} from "react";
import {AppContext} from "../AppContext";

export default function FolderView() {

    const {currentManifest, setCurrentManifest, authDate, currentFolder} = useContext(AppContext);
    const [mode, setMode] = useState<string>('icon-view');
    if (!currentManifest || !currentFolder) {
        return  <></>;
    }

    if (currentFolder.restricted) {
        return <div className="aiiif-folder-view-container" />;
    }

    const files = currentFolder.manifests;
    const folders = currentFolder.collections;

    if (files.length === 0 && folders.length === 0) {

        return (
            <div className="aiiif-folder-view-container">
                <div>
                    <h1>{getLocalized(currentFolder.label)}</h1>
                    <div className="aiiif-empty">
                        <Translation ns="common">{(t, { i18n }) => <p>{t('emptyFolder')}</p>}</Translation>
                    </div>
                </div>
            </div>
        );
    }

    const content = [];
    for (const folder of folders) {
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
    for (const file of files) {
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

    const folderViewClassNames = 'aiiif-folder-view aiiif-' + mode;

    return (
        <div className="aiiif-folder-view-container">
            <nav className="aiiif-bar">
                <div className="aiiif-icon-button" onClick={() => setMode('icon-view')}>
                    <ViewSymbolsIcon />
                    <Translation ns="common">{(t, { i18n }) => <p>{t('iconView')}</p>}</Translation>
                </div>
                <div className="aiiif-icon-button" onClick={() => setMode('list-view')}>
                    <ViewListIcon />
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
