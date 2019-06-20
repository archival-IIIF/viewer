import * as React from 'react';
import Manifest from './lib/Manifest';
import ManifestHistory from './lib/ManifestHistory';
import Cache from './lib/Cache';
import TouchDetection from './lib/TouchDetection';
require('./css/item.css');
const FolderImage = require('./icons/fa/folder.svg');
const FileImage = require('./icons/fa/file.svg');

interface IProps {
    item: object;
    selected: object;
}

interface IState {
    item: any;
    itemType: any;
    selected: any;
}

class Item extends React.Component<IProps, IState> {

    constructor(props) {

        super(props);

        const itemType = props.item.type === 'sc:Collection' ? 'folder' : 'file';

        this.state = {
            item: props.item,
            itemType,
            selected: props.selected,
        };
    }


    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
    }

    render() {

        const id = this.state.item.id;
        let className = 'item ' + this.state.itemType;
        const label = this.state.item.label;
        const style = {backgroundImage: this.getThumbnail()};
        if (id === this.state.selected) {
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

        if (this.state.item.thumbnail === undefined || !this.state.item.thumbnail.hasOwnProperty('id')) {
            if (this.state.item.type === 'sc:Collection') {
                return `url(${FolderImage})`;
            }

            return `url(${FileImage})`;
        }

        let thumbnailUrl;
        if (this.state.item.thumbnail.hasOwnProperty('service')) {
            const width = '72';
            const height = '72';
            const serviceUrl = this.state.item.thumbnail.service;
            thumbnailUrl = serviceUrl.replace('/info.json', '') + '/full/!' + width + ',' + height + '/0/default.jpg';
        } else {
            thumbnailUrl = this.state.item.thumbnail.id;
        }

        return `url(${thumbnailUrl})`;
    }

    open() {
        if (this.state.itemType === 'folder') {
            Cache.ee.emit('open-folder', this.state.item.id);
        } else {
            this.openFile(this.state.item);
        }
    }

    activateItem() {

        const manifestDataId = this.state.item.id;

        if (TouchDetection.isTouchDevice() && manifestDataId === this.state.selected) {
            this.open();
            return;
        }

        Manifest.get(
            manifestDataId,
            function(manifestData) {
                ManifestHistory.pageChanged(manifestData.id, manifestData.label);
                Cache.ee.emit('update-file-info', manifestData);
            }
        );


    }


    openFile(file0) {

        const manifestId = file0.id;

        Manifest.get(
            manifestId,
            function(file) {
                const type = file.resource.type;
                if (type === 'audioVideo') {
                    Cache.ee.emit('play-audio', file.resource.source);
                } else if (type === 'file') {
                    const win = window.open(file.resource.source, '_target');
                    win.focus();
                }
            }
        );


    }


}

export default Item;
