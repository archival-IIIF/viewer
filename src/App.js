import React, {Component} from 'react';
import './css/App.css';
import FolderView from './FolderView';
import TreeView from './TreeView';
import Splitter from './Splitter';
import FileInfo from './FileInfo';
import EventEmitter from 'wolfy87-eventemitter/EventEmitter';
import Viewer from './Viewer';
import TopBar from './TopBar';
import ManifestHistory from './lib/ManifestHistory';
import Login from './Login';


class App extends Component {

    constructor(props) {

        super(props);

        global.ee = new EventEmitter();
        global.intialWidth = 300;
        global.viewerHeight = 18;
        global.splitterWidth = 8;
        global.token = '';


        this.state = {
            className: '',
            contentLeft: global.intialWidth +  global.splitterWidth,
        }

    }



    render() {

        return (
            <div id="app">
                <TopBar />
                <Login />
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
                className: 'no-select',
                contentLeft: width + global.splitterWidth
            }
        );
    }

    splitterMoveEnd() {
        this.setState(
            {className: ''}
        );
    }

    splitterDoubleClick() {
        if (this.state.width <= this.minWidth) {
            this.setState({contentLeft: global.splitterWidth})
        }

    }
    
    componentDidMount() {

        window.addEventListener('popstate', function(event) {
           ManifestHistory.goBack();
        });

        global.ee.addListener('splitter-move', this.splitterMove.bind(this));
        global.ee.addListener('splitter-move-end', this.splitterMoveEnd.bind(this));
    }

}

export default App;
