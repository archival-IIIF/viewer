import React, {useContext, useEffect} from 'react';
import Loading from '../../Loading';
import TreeViewItem from './TreeViewItem';
import './treeview.css';
import PresentationApi from "../../fetch/PresentationApi";
import {AppContext} from "../../AppContext";

interface IProps {
    currentFolderId?: string;
    setCurrentManifest: (id: string) => void;
}

export default function TreeView(props: IProps) {

    const {treeDate} = useContext(AppContext);
    const rootId = PresentationApi.getRootId();

    // reload if tree was loaded
    useEffect(() => {}, [treeDate])

    if (!rootId) {
        return <Loading/>;
    }

    const rootManifest = PresentationApi.fetchFromCache(rootId);
    if (!rootManifest) {
        return <></>;
    }


    return <div className="aiiif-treeview">
        <TreeViewItem
            key={Math.random()}
            id={rootManifest.id}
            label={rootManifest.label}
            children={rootManifest.collections ?? []}
            level={1}
            currentFolderId={props.currentFolderId}
            setCurrentManifest={props.setCurrentManifest}
        />
    </div>;
}
