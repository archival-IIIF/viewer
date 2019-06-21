import * as React from 'react';

const s = require('./css/App.css');
import FolderView from './FolderView';
import FileInfo from './FileInfo';
import Viewer from './Viewer';
import TopBar from './TopBar';
import ManifestHistory from './lib/ManifestHistory';
import Login from './Login';
import Cache from './lib/Cache';
import TreeViewContainer from './TreeViewContainer';

interface IState {
    contentLeft: number;
    folderAndInfoLeft?: number;
    folderAndInfoTop?: number;
    width?: number;
}

class App extends React.Component<{}, IState> {

    private minWidth = 60;

    constructor(props) {

        super(props);


        this.state = {
            contentLeft: Cache.intialWidth + Cache.splitterWidth,
        };

    }

    render() {

        return (
            <div id="app">
                <TopBar/>
                <Login/>
                <div id="main">
                    <TreeViewContainer />
                    <div id="content" style={{left: this.state.contentLeft}}>
                        <Viewer/>
                        <div id="folder-and-info" style={{
                            left: this.state.folderAndInfoLeft,
                            top: this.state.folderAndInfoTop
                        }}>
                            <FolderView/>
                            <FileInfo/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    splitterMove(width) {
        this.setState(
            {
                contentLeft: width + Cache.splitterWidth
            }
        );
    }


    splitterDoubleClick() {
        if (this.state.width <= this.minWidth) {
            this.setState({contentLeft: Cache.splitterWidth});
        }

    }

    componentDidMount() {

        window.addEventListener('popstate', function(event) {
            ManifestHistory.goBack();
        });

        Cache.ee.addListener('splitter-move', this.splitterMove.bind(this));
    }

}

export default App;
