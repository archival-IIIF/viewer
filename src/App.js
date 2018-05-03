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


        window.onpopstate = function(event) {
            let id = Manifest.getIdFromCurrentUrl();
            global.ee.emitEvent('open-folder', [id]);
        };

        this.state = {
            className: ""
        }

    }



    render() {

        return (
            <div id="app">
                <div id="main" className={this.state.className}>
                    <TreeView />
                    <Splitter />
                    <div id="content">
                        <Viewer/>
                        <div id="folder-and-info">
                            <FolderView/>
                            <FileInfo />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    splitterMove() {
        this.setState(
            {className: "no-select"}
        )
    }

    splitterMoveEnd() {
        this.setState(
            {className: ""}
        )
    }

    componentDidMount() {
        global.ee.addListener('splitter-move', this.splitterMove.bind(this));
        global.ee.addListener('splitter-move-end', this.splitterMoveEnd.bind(this));
    }

}

export default App;
