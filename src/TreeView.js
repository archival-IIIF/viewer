import React from 'react';
import './css/treeview.css';
import Loading from './Loading';
import TreeViewItem from './TreeViewItem';
import Manifest from './lib/Manifest';

class TreeView extends React.Component {

    constructor(props) {

        super(props);

        this.minWidth = 60;

        this.state = {
            opened: {},
            tree: false,
            width: global.intialWidth,
        };

        this.treeInProgress = null;

        this.currentFolderId = false;
    }

    render() {

        if (this.state.width < this.minWidth ) {
            return '';
        }

        if (this.state.tree === false) {
            return <Loading/>;
        }

        return (
            <div id="treeview" style={{maxWidth: this.state.width, minWidth: this.state.width}} >
                <TreeViewItem data={this.state.tree} level={1} opened={true} currentFolderId={this.currentFolderId}/>
            </div>
        );
    }


    buildTree(folderId) {

        if (this.state.tree !== false) {
            return;
        }

        if (this.treeInProgress === null ) {
            this.currentFolderId = folderId;
        }

        let url = folderId;
        let manifestData = Manifest.fetchFromCache(url);
        manifestData.opened = true;


        if (this.treeInProgress !== null) {

            let collections = manifestData.collections;
            for (let collection in collections) {
                if (collections[collection].id === this.treeInProgress.id) {
                    collections[collection] = this.treeInProgress;
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

        let t = this;
        Manifest.get(
            url,
            function (manifestData) {

                if (typeof manifestData === 'string') {
                    alert(manifestData);
                    return;
                }

                t.buildTree(manifestData.id);
            }
        );
    }


    splitterMove(width) {
        this.setState(
            {width: width}
        )
    }

    splitterDoubleClick() {
        if (this.state.width > this.minWidth) {
            this.setState({width: 0})
        } else {
            this.setState({width: this.intialWidth})
        }

    }

    splitterMove = this.splitterMove.bind(this);
    splitterDoubleClick = this.splitterDoubleClick.bind(this);
    updateCurrentFolderId = this.buildTree.bind(this);

    componentDidMount() {
        global.ee.addListener('splitter-move', this.splitterMove);
        global.ee.addListener('splitter-double-click', this.splitterDoubleClick);
        global.ee.addListener('update-current-folder-id', this.updateCurrentFolderId);
    }

    componentWillUnmount() {
        global.ee.removeListener('splitter-move', this.splitterMove);
        global.ee.removeListener('splitter-move-end', this.splitterDoubleClick);
        global.ee.removeListener('update-current-folder-id', this.updateCurrentFolderId);
    }



}

export default TreeView;