import * as React from 'react';
import Loading from './Loading';
import TreeViewItem from './TreeViewItem';
import Manifest from './lib/Manifest';
import Cache from './lib/Cache';
import './css/treeview.css';

interface IState {
    opened: object;
    tree: object | null;
}

class TreeView extends React.Component<{}, IState> {

    private treeInProgress: any = null;
    private currentFolderId = '';


    constructor(props: {}) {

        super(props);

        this.state = {
            opened: {},
            tree: null,
        };

        this.buildTree = this.buildTree.bind(this);
        this.clearTree = this.clearTree.bind(this);
    }

    render() {

        if (this.state.tree === null) {
            return <Loading/>;
        }
        return (
            <div id="treeview">
                <TreeViewItem data={this.state.tree} level={1} opened={true} currentFolderId={this.currentFolderId}/>
            </div>
        );
    }


    buildTree(folderId: string) {

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
                if (collections.hasOwnProperty(collection)) {
                    if (this.treeInProgress) {
                        if (collections[collection].id === this.treeInProgress.id) {
                            collections[collection] = this.treeInProgress;
                        }
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
            function(manifestData2: any) {

                if (typeof manifestData2 === 'string') {
                    alert(manifestData2);
                    return;
                }

                t.buildTree(manifestData2.id);
            }
        );
    }

    clearTree() {
        this.setState({tree: null});
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
