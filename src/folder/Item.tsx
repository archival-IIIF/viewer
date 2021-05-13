import * as React from 'react';
import Cache from '../lib/Cache';
import TouchDetection from '../lib/TouchDetection';
import IManifestData, {IManifestReference} from '../interface/IManifestData';
import './item.css';
import {getLocalized} from "../lib/ManifestHelpers";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileAlt, faFolder} from "@fortawesome/free-solid-svg-icons";

interface IProps {
    item: IManifestReference;
    selected: IManifestData;
    authDate: number;
    setCurrentManifest: (id?: string) => void;
}

export default  function Item(props: IProps) {

    const itemType = props.item.type === 'Collection' ? 'folder' : 'file';
    const id = props.item.id;
    let className = 'aiiif-item ' + itemType;
    const label = getLocalized(props.item.label);
    if (id === props.selected.id) {
        className += ' active';
    }

    return <div
        className={className}
        key={id}
        onClick={() => activateItem(props)}
        onDoubleClick={() => open(props)}
    >
        {getThumbnail(props)}
        <div className="aiiif-item-label">{label}</div>
    </div>;
}

function getThumbnail(props: IProps) {

    if (props.item.thumbnail === undefined || !props.item.thumbnail.hasOwnProperty('id')) {
        if (props.item.type === 'Collection') {
            return <div className="aiiif-item-thumbnail">
                <FontAwesomeIcon icon={faFolder} />
            </div>;
        }

        return <div className="aiiif-item-thumbnail">
            <FontAwesomeIcon icon={faFileAlt} />
        </div>;
    }


    let thumbnailUrl;
    if (props.item.thumbnail.hasOwnProperty('service') && props.item.thumbnail.service) {
        const width = '72';
        const height = '72';
        const serviceUrl = props.item.thumbnail.service;
        thumbnailUrl = serviceUrl.replace('/info.json', '') + '/full/!' + width + ',' + height + '/0/default.jpg';
    } else {
        thumbnailUrl = props.item.thumbnail.id;
    }
    if (props.authDate > 0) {
        thumbnailUrl += '?t=' + props.authDate.toString();
    }

    const style = {backgroundImage: 'url(' + thumbnailUrl + ')'};
    return <div className="aiiif-item-thumbnail" style={style} />;
}

function open(props: IProps) {
    if (props.item.type === 'Collection') {
        props.setCurrentManifest(props.item.id);
    } else {
        openFile(props);
    }
}

function activateItem(props: IProps) {
    if (TouchDetection.isTouchDevice() && props.item.id === props.selected.id) {
        open(props);
    } else {
        props.setCurrentManifest(props.item.id);
    }
}

function openFile(props: IProps) {

    if (!props.selected.resource) {
        return;
    }

    if (props.selected.itemsType === 'audioVideo') {
        Cache.ee.emit('play-audio', props.selected.resource.id);
    } else if (props.selected.itemsType === 'file') {
        const win = window.open(props.selected.resource.id, '_target');
        if (win) {
            win.focus();
        }
    }
}
