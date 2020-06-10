import * as React from 'react';
import Loading from '../Loading';
import TreeViewItem from './TreeViewItem';
import Cache from '../lib/Cache';
import './treeview.css';
import ITree from "../interface/ITree";
import TreeBuilder from "./TreeBuilder";

interface IState {
    tree?: ITree,
    currentFolderId?: string;
}

class TreeView extends React.Component<{}, IState> {


    constructor(props: {}) {
        super(props);

        this.state = {};

        this.buildTree = this.buildTree.bind(this);
        this.clearTree = this.clearTree.bind(this);
    }

    render() {

        if (this.state.tree === null) {
            return <Loading/>;
        }
        return (
            <div id="treeview">
                <TreeViewItem key={this.state.tree ? this.state.tree.id : -1} tree={this.state.tree} level={1}
                           currentFolderId={this.state.currentFolderId}
                           isOpen={this.state.tree ? this.state.tree.isOpen : false}/>
            </div>
        );
    }

    buildTree(id: string) {
        if (!this.state.tree) {
            const t = this;
            TreeBuilder.get(id, undefined, (tree) => {
                t.setState({tree, currentFolderId: id});
            });
        } else {
            this.setState({currentFolderId: id});
        }
    }

    clearTree() {
        this.setState({tree: undefined});
    }

    componentDidMount() {
        Cache.ee.addListener('update-current-folder-id', this.buildTree);
        Cache.ee.addListener('token-received', this.clearTree);
    }

    componentWillUnmount() {
        Cache.ee.removeListener('update-current-folder-id', this.buildTree);
        Cache.ee.removeListener('token-received', this.clearTree);
    }
}

export default TreeView;
