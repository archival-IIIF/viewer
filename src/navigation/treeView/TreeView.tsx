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

class TreeView extends React.Component<IProps, {}> {

    render() {

        if (!this.props.tree) {
            return <Loading/>;
        }

        return (
            <div id="treeview">
                <TreeViewItem
                    key={Math.random()}
                    tree={this.props.tree}
                    level={1}
                    currentFolderId={this.props.currentFolderId}
                    isOpen={this.props.tree.isOpen}
                    setCurrentManifest={this.props.setCurrentManifest}
                />
            </div>
        );
    }
}

export default TreeView;
