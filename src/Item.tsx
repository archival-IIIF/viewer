import * as React from 'react';
import Manifest from './lib/Manifest';
import ManifestHistory from './lib/ManifestHistory';
import Cache from './lib/Cache';
import TouchDetection from './lib/TouchDetection';
import IManifestData from './interface/IManifestData';
import './css/item.css';
const FolderImage = require('./icons/fa/folder.svg');
const FileImage = require('./icons/fa/file.svg');

interface IProps {
    item: IManifestData;
    selected?: string;
}

class Item extends React.Component<IProps, {}> {


    render() {

        const itemType = this.props.item.type === 'sc:Collection' ? 'folder' : 'file';
        const id = this.props.item.id;
        let className = 'item ' + itemType;
        const label = this.props.item.label;
        const style = {backgroundImage: this.getThumbnail()};
        if (id === this.props.selected) {
            className += ' active';
        }

        return <div
            className={className}
            key={id}
            onClick={() => this.activateItem()}
            onDoubleClick={() => this.open()}
        >
            <div className="item-thumbnail" style={style} />
            <div className="item-label">{label}</div>
        </div>;
    }

    getThumbnail() {

        if (this.props.item.thumbnail === undefined || !this.props.item.thumbnail.hasOwnProperty('id')) {
            if (this.props.item.type === 'sc:Collection' || this.props.item.type === 'Collection') {
                return `url(${FolderImage})`;
            }

            return `url(${FileImage})`;
        }

        let thumbnailUrl;
        if (this.props.item.thumbnail.hasOwnProperty('service') && this.props.item.thumbnail.service) {
            const width = '72';
            const height = '72';
            const serviceUrl = this.props.item.thumbnail.service;
            thumbnailUrl = serviceUrl.replace('/info.json', '') + '/full/!' + width + ',' + height + '/0/default.jpg';
        } else {
            thumbnailUrl = this.props.item.thumbnail.id;
        }

        return `url(${thumbnailUrl})`;
    }

    open() {
        if (this.props.item.type === 'sc:Collection') {
            Cache.ee.emit('open-folder', this.props.item.id);
        } else {
            this.openFile(this.props.item);
        }
    }

    activateItem() {

        const manifestDataId = this.props.item.id;

        if (TouchDetection.isTouchDevice() && manifestDataId === this.props.selected) {
            this.open();
            return;
        }

        Manifest.get(
            manifestDataId,
            function(manifestData: any) {
                ManifestHistory.pageChanged(manifestData.id, manifestData.label);
                Cache.ee.emit('update-file-info', manifestData);
            }
        );


    }

    openFile(file0: any) {

        const manifestId = file0.id;

        Manifest.get(
            manifestId,
            function(file: any) {
                const type = file.resource.type;
                if (type === 'audioVideo') {
                    Cache.ee.emit('play-audio', file.resource.source);
                } else if (type === 'file') {
                    const win = window.open(file.resource.source, '_target');
                    if (win) {
                        win.focus();
                    }
                }
            }
        );
    }
}

export default Item;
