import * as React from 'react';
import Loading from './Loading';
import Item from './Item';
import Manifest from './lib/Manifest';
import ManifestHistory from './lib/ManifestHistory';
import {translate, Trans} from 'react-i18next';
import Cache from './lib/Cache';

class FolderView extends React.Component<{}, any> {

    constructor(props) {

        super(props);


        this.state = {
            data: false,
            mode: 'icon-view',
            selected: null
        };

        this.openFolder = this.openFolder.bind(this);
        this.showListView = this.showListView.bind(this);
        this.showIconView = this.showIconView.bind(this);
        this.updateFileInfo = this.updateFileInfo.bind(this);
    }


    render() {

        if (!this.state.data) {
            return (
                <Loading/>
            );
        }

        if (this.state.data.restricted) {
            return <div id="folder-view-container" />;
        }

        const files = this.state.data.manifests;
        const folders = this.state.data.collections;

        if (files.length === 0 && folders.length === 0) {

            return (
                <div id="folder-view-container">
                    <h1>{this.state.data.label}</h1>
                    <div className="empty"><Trans i18nKey="emptyFolder"/></div>
                </div>
            );
        }

        const content = [];
        for (const folder of folders) {
            content.push(
                <Item item={folder} selected={this.state.selected} key={folder.id} />
            );
        }
        for (const file of files) {
            content.push(
                <Item item={file} selected={this.state.selected} key={file.id} />
            );
        }

        const folderViewClassNames = 'folder-view ' + this.state.mode;

        return (
            <div id="folder-view-container">
                <h1>{this.state.data.label}</h1>
                <div className={folderViewClassNames}>{content}</div>
            </div>
        );
    }

    openFolder(itemId, selectedData, pageReload) {

        if (itemId === false) {
            alert('No manifest ID given!');
            return;
        }

        const t = this;
        const url = itemId;

        Manifest.get(
            url,
            (manifestData) =>  {

                if (typeof manifestData === 'string') {
                    alert(manifestData);
                    return;
                }

                if (manifestData.type !== 'sc:Collection') {
                    if (!manifestData.parentId) {
                        t.openImaginaryRootFolder(manifestData);
                        return;
                    }

                    t.openFolder(manifestData.parentId, manifestData, false);
                    return;
                }

                let selected = null;
                if (selectedData) {
                    selected = selectedData.id;
                } else {
                    selectedData = manifestData;
                }

                t.setState({
                    data: manifestData,
                    selected
                });
                if (pageReload !== false) {
                    ManifestHistory.pageChanged(manifestData.id, manifestData.label);
                }

                if (manifestData.restricted === true) {
                    document.title = manifestData.label;
                }

                Cache.ee.emitEvent('update-current-folder-id', [manifestData.id]);
                Cache.ee.emitEvent('update-file-info', [selectedData]);
            }
        );

    }

    openImaginaryRootFolder(manifestData) {
        const imaginaryRootManifestData = {
            collections: [],
            id: '-',
            manifests: [manifestData],
            type: 'sc:Collection'
        };

        this.setState({
            data: imaginaryRootManifestData,
            selected: manifestData.id
        });

        Cache.ee.emitEvent('update-file-info', [manifestData]);
    }

    showListView() {
        this.setState({mode: 'list-view'});
    }

    showIconView() {
        this.setState({mode: 'icon-view'});
    }

    componentDidMount() {
        Cache.ee.addListener('show-list-view', this.showListView);
        Cache.ee.addListener('show-icon-view', this.showIconView);
        Cache.ee.addListener('open-folder', this.openFolder);
        Cache.ee.addListener('update-file-info', this.updateFileInfo);

        const id = Manifest.getIdFromCurrentUrl();
        this.openFolder(id, null, null);
    }

    componentWillUnmount() {
        Cache.ee.removeListener('show-list-view', this.showListView);
        Cache.ee.removeListener('show-icon-view', this.showIconView);
        Cache.ee.removeListener('open-folder', this.openFolder);
        Cache.ee.removeListener('update-file-info', this.updateFileInfo);
    }

    updateFileInfo(manifestData) {
        if (this.state.selected === manifestData.id) {
            return;
        }

        this.setState({
            selected: manifestData.id
        });
    }


}

export default translate('common')(FolderView);
