import * as React from 'react';
import Item from './Item';
import IManifestData from '../interface/IManifestData';
import {Translation} from 'react-i18next';
import ViewSymbolsIcon from "@material-ui/icons/ViewComfy";
import ViewListIcon from "@material-ui/icons/ViewList";

interface IState {
    mode: string;
}

interface IProps {
    currentManifest: IManifestData;
    currentFolder: IManifestData;
    authDate: number;
    setCurrentManifest: (id?: string) => void;
}

class FolderView extends React.Component<IProps, IState> {

    constructor(props: any) {

        super(props);

        this.state = {mode: 'icon-view',};

        this.showListView = this.showListView.bind(this);
        this.showIconView = this.showIconView.bind(this);
    }


    render() {

        if (this.props.currentFolder.restricted) {
            return <div className="aiiif-folder-view-container" />;
        }

        const files = this.props.currentFolder.manifests;
        const folders = this.props.currentFolder.collections;

        if (files.length === 0 && folders.length === 0) {

            return (
                <div className="aiiif-folder-view-container">
                    <div>
                        <h1>{this.props.currentFolder.label}</h1>
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
                    selected={this.props.currentManifest}
                    key={folder.id}
                    setCurrentManifest={this.props.setCurrentManifest}
                    authDate={this.props.authDate}
                />
            );
        }
        for (const file of files) {
            content.push(
                <Item
                    item={file}
                    selected={this.props.currentManifest}
                    key={file.id}
                    setCurrentManifest={this.props.setCurrentManifest}
                    authDate={this.props.authDate}
                />
            );
        }

        const folderViewClassNames = 'aiiif-folder-view aiiif-' + this.state.mode;

        return (
            <div className="aiiif-folder-view-container">
                <nav className="aiiif-bar">
                    <div className="aiiif-icon-button" onClick={this.showIconView}>
                        <ViewSymbolsIcon />
                        <Translation ns="common">{(t, { i18n }) => <p>{t('iconView')}</p>}</Translation>
                    </div>
                    <div className="aiiif-icon-button" onClick={this.showListView}>
                        <ViewListIcon />
                        <Translation ns="common">{(t, { i18n }) => <p>{t('listView')}</p>}</Translation>
                    </div>
                </nav>
                <div>
                    <h1>{this.props.currentFolder.label}</h1>
                    <div className={folderViewClassNames}>{content}</div>
                </div>

            </div>
        );
    }

    showListView() {
        this.setState({mode: 'list-view'});
    }

    showIconView() {
        this.setState({mode: 'icon-view'});
    }
}

export default FolderView;
