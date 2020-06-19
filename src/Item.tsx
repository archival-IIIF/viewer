import * as React from 'react';
import Cache from './lib/Cache';
import TouchDetection from './lib/TouchDetection';
import IManifestData from './interface/IManifestData';
import './css/item.css';
import FolderIcon from "./icons/fa/FolderIcon";
import FileIcon from "./icons/fa/FileIcon";

interface IProps {
    item: IManifestData;
    selected: IManifestData;
    authDate: number;
    setCurrentManifest: (id?: string) => void;
}

class Item extends React.Component<IProps, {}> {


    render() {

        const itemType = this.props.item.type === 'Collection' ? 'folder' : 'file';
        const id = this.props.item.id;
        let className = 'item ' + itemType;
        const label = this.props.item.label;
        if (id === this.props.selected.id) {
            className += ' active';
        }

        return <div
            className={className}
            key={id}
            onClick={() => this.activateItem()}
            onDoubleClick={() => this.open()}
        >
            {this.getThumbnail()}
            <div className="item-label">{label}</div>
        </div>;
    }

    getThumbnail() {

        if (this.props.item.thumbnail === undefined || !this.props.item.thumbnail.hasOwnProperty('id')) {
            if (this.props.item.type === 'Collection') {
                return <div className="item-thumbnail"><FolderIcon  /></div>;
            }

            return <div className="item-thumbnail"><FileIcon /></div>;
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
        if (this.props.authDate > 0) {
            thumbnailUrl += '?t=' + this.props.authDate.toString();
        }

        const style = {backgroundImage: 'url(' + thumbnailUrl + ')'};
        return <div className="item-thumbnail" style={style} />;
    }

    open() {
        if (this.props.item.type === 'Collection') {
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
