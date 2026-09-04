import {useContext, useEffect} from 'react';
import TreeViewItem from './TreeViewItem';
import './treeview.css';
import PresentationApi from "../fetch/PresentationApi";
import {AppContext} from "../AppContext";
import ViewerSpinner from "../viewer/ViewerSpinner";

export default function TreeView() {

    const {treeDate} = useContext(AppContext);
    const rootId = PresentationApi.getRootId();

    // reload if tree was loaded
    useEffect(() => {}, [treeDate])

    if (!rootId) {
        return <div className="aiiif-treeview">
            <ViewerSpinner show={true} center={false}/>
        </div>;
    }

    const rootManifest = PresentationApi.fetchFromCache(rootId);
    if (!rootManifest) {
        return null;
    }


    return <div className="aiiif-treeview">
        <TreeViewItem
            key={Math.random()}
            id={rootManifest.id}
            label={rootManifest.label}
            level={1}
        >
            {rootManifest.collections ?? []}
        </TreeViewItem>
    </div>;
}
