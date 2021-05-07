import * as React from 'react';
import Loading from '../../Loading';
import TreeViewItem from './TreeViewItem';
import './treeview.css';
import ITree from "../../interface/ITree";

interface IProps {
    tree?: ITree;
    currentFolderId?: string;
    setCurrentManifest: (id: string) => void;
}

export default function TreeView(props: IProps) {

    if (!props.tree) {
        return <Loading/>;
    }

    return <div className="aiiif-treeview">
        <TreeViewItem
            key={Math.random()}
            tree={props.tree}
            level={1}
            currentFolderId={props.currentFolderId}
            isOpen={props.tree.isOpen}
            setCurrentManifest={props.setCurrentManifest}
        />
    </div>;
}
