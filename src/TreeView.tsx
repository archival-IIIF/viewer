import * as React from 'react';
require('./css/treeview.css');
import Loading from './Loading';
import TreeViewItem from './TreeViewItem';
import Manifest from './lib/Manifest';
import Cache from './lib/Cache';

class TreeView extends React.Component<{}, any> {

    private minWidth = 60;
    private treeInProgress = null;
    private currentFolderId = null;


    constructor(props) {

        super(props);

        this.state = {
            opened: {},
            tree: false,
            width: Cache.intialWidth,
        };

        this.splitterMove = this.splitterMove.bind(this);
        this.splitterDoubleClick = this.splitterDoubleClick.bind(this);
        this.buildTree = this.buildTree.bind(this);
        this.clearTree = this.clearTree.bind(this);
    }

    render() {

        if (this.state.width < this.minWidth) {
            return '';
        }

        if (this.state.tree === false) {
            return <Loading/>;
        }

        return (
            <div id="treeview" style={{maxWidth: this.state.width, minWidth: this.state.width}}>
                <TreeViewItem data={this.state.tree} level={1} opened={true} currentFolderId={this.currentFolderId}/>
            </div>
        );
    }


    buildTree(folderId) {

        if (this.state.tree !== false) {
            return;
        }

        if (this.treeInProgress === null) {
            this.currentFolderId = folderId;
        }

        let url = folderId;
        const manifestData = Manifest.fetchFromCache(url);
        if (manifestData === false) {
            return;
        }
        manifestData.opened = true;

        if (this.treeInProgress !== null) {

            const collections = manifestData.collections;
            for (const collection in collections) {
                if (collections.has(collection)) {
                    if (collections[collection].id === this.treeInProgress.id) {
                        collections[collection] = this.treeInProgress;
                    }
                }
            }
        }

        if (manifestData.parentId === undefined) {
            this.setState({
                tree: manifestData
            });

            document.title = manifestData.label;

            return;
        }

        this.treeInProgress = manifestData;
        url = manifestData.parentId;

        const t = this;
        Manifest.get(
            url,
            function(manifestData2) {

                if (typeof manifestData2 === 'string') {
                    alert(manifestData2);
                    return;
                }

                t.buildTree(manifestData2.id);
            }
        );
    }


    splitterMove(width) {
        this.setState(
            {width}
        );
    }

    splitterDoubleClick() {
        if (this.state.width > this.minWidth) {
            this.setState({width: 0});
        } else {
            this.setState({width: Cache.intialWidth});
        }
    }


    clearTree() {
        this.setState({tree: false});
    }

    componentDidMount() {
        Cache.ee.addListener('splitter-move', this.splitterMove);
        Cache.ee.addListener('splitter-double-click', this.splitterDoubleClick);
        Cache.ee.addListener('update-current-folder-id', this.buildTree);
        Cache.ee.addListener('token-received', this.clearTree);
    }

    componentWillUnmount() {
        Cache.ee.removeListener('splitter-move', this.splitterMove);
        Cache.ee.removeListener('splitter-move-end', this.splitterDoubleClick);
        Cache.ee.removeListener('update-current-folder-id', this.buildTree);
        Cache.ee.removeListener('token-received', this.clearTree);
    }
}

export default TreeView;
