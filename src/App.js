import React, {Component} from 'react';
import './css/App.css';
import FolderView from './FolderView';
import TreeView from './TreeView';
import Splitter from './Splitter';
import FileInfo from './FileInfo';
import EventEmitter from "wolfy87-eventemitter/EventEmitter";
import Manifest from "./lib/Manifest";
import Viewer from "./Viewer";


class App extends Component {

    constructor(props) {

        super(props);

        global.ee = new EventEmitter();
        global.intialWidth = 300;
        global.splitterWidth = 8;


        window.onpopstate = function(event) {
            let id = Manifest.getIdFromCurrentUrl();
            global.ee.emitEvent('open-folder', [id]);
        };

        this.state = {
            className: "",
            contentLeft: global.intialWidth,
            folderAndInfoTop: 0,
            folderAndInfoLeft: global.intialWidth +  global.splitterWidth
        }

    }



    render() {

        return (
            <div id="app">
                <div id="main" className={this.state.className}>
                    <TreeView />
                    <Splitter />
                    <div id="content" style={{left: this.state.contentLeft}}>
                        <Viewer/>
                        <div id="folder-and-info" style={{top: this.state.folderAndInfoTop, left: this.state.folderAndInfoLeft}}>
                            <FolderView/>
                            <FileInfo />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    splitterMove(width) {
        this.setState(
            {
                className: "no-select",
                contentLeft: width + global.splitterWidth
            }
        );
    }

    splitterMoveEnd() {
        this.setState(
            {className: ""}
        );
    }

    splitterDoubleClick() {
        if (this.state.width <= this.minWidth) {
            this.setState({contentLeft: global.splitterWidth})
        }

    }

    viewerActivated() {
        this.setState({folderAndInfoTop: document.getElementById("viewer").clientHeight});
    }

    viewerDeactivated() {
        this.setState({folderAndInfoTop: 0});
    }


    viewerActivated = this.viewerActivated.bind(this);
    viewerDeactivated = this.viewerDeactivated.bind(this);



    componentDidMount() {
        global.ee.addListener('splitter-move', this.splitterMove.bind(this));
        global.ee.addListener('splitter-move-end', this.splitterMoveEnd.bind(this));
        global.ee.addListener('viewer-activated', this.viewerActivated);
        global.ee.addListener('viewer-deactivated', this.viewerDeactivated);
    }

    componentWillUnmount() {
        global.ee.addListener('viewer-activated', this.viewerActivated);
        global.ee.addListener('viewer-deactivated', this.viewerDeactivated);
    }

}

export default App;
