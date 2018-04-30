import React from "react";
import './css/treeview.css';
import Loading from "./Loading";
import TreeViewItem from "./TreeViewItem";
import Manifest from "./lib/Manifest";

class TreeView extends React.Component {

    constructor(props) {

        super(props);

        this.minWidth = 60;
        this.intialWidth = 300;

        this.state = {
            opened: {},
            tree: false,
            width: this.intialWidth,
        };

        this.treeInProgress = null;

        this.currentFolderId = false;
    }

    render() {

        if (this.state.width < this.minWidth ) {
            return "";
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

        if (this.treeInProgress === null ) {
            this.currentFolderId = folderId;
        }

        let url = folderId+"/manifest.json";
        let data = Manifest.fetchFromCache(url);
        data.opened = true;

        if (this.treeInProgress !== null) {

            for (let collection in data["collections"]) {
                if (data.collections[collection]["@id"] === this.treeInProgress["@id"]) {
                    data.collections[collection] = this.treeInProgress;
                }
            }
        }

        if (!data.hasOwnProperty("within")) {
            this.setState({
                tree: data
            });

            document.title = data["label"];

            return;
        }

        this.treeInProgress = data;
        url = data.within+"/manifest.json";
        let t = this;
        Manifest.get(
            url,
            function (data) {

                if (typeof data === "string") {
                    alert(data);
                    return;
                }

                t.buildTree(data["@id"]);
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