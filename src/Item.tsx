import * as React from 'react';
import Cache from './lib/Cache';
import TouchDetection from './lib/TouchDetection';
import IManifestData from './interface/IManifestData';
import './css/item.css';
const FolderImage = require('./icons/fa/folder.svg');
const FileImage = require('./icons/fa/file.svg');

interface IProps {
    item: IManifestData;
    selected: IManifestData;
    setCurrentManifest: (id?: string) => void;
}

class Item extends React.Component<IProps, {}> {


    render() {

        const itemType = this.props.item.type === 'sc:Collection' ? 'folder' : 'file';
        const id = this.props.item.id;
        let className = 'item ' + itemType;
        const label = this.props.item.label;
        const style = {backgroundImage: this.getThumbnail()};
        if (id === this.props.selected.id) {
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
            this.props.setCurrentManifest(this.props.item.id);
        } else {
            this.openFile();
        }
    }

    activateItem() {
        if (TouchDetection.isTouchDevice() && this.props.item.id === this.props.selected.id) {
            this.open();
        } else {
            this.props.setCurrentManifest(this.props.item.id);
        }
    }

    openFile() {

        if (!this.props.selected.resource) {
            return;
        }

        const type = this.props.selected.resource.type;
        if (type === 'audio' || type === 'video') {
            Cache.ee.emit('play-audio', this.props.selected.resource.source);
        } else if (type === 'file') {
            const win = window.open(this.props.selected.resource.id, '_target');
            if (win) {
                win.focus();
            }
        }
    }
}

export default Item;
