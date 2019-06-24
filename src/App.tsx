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
import Alert from './Alert';

interface IState {
    folderAndInfoLeft?: number;
    folderAndInfoTop?: number;
    treeViewWidth: number;
}

class App extends React.Component<{}, IState> {

    private minWidth: number = 60;

    constructor(props) {

        super(props);


        this.state = {
            treeViewWidth: Cache.intialWidth
        };

        this.treeViewWidthChanged = this.treeViewWidthChanged.bind(this);
    }

    render() {

        const contentStyle = {
            left: this.state.treeViewWidth + Cache.getSplitterWidth(this.state.treeViewWidth === 0)
        };

        return (
            <div id="app">
                <TopBar/>
                <Login/>
                <div id="main">
                    <TreeViewContainer width={this.state.treeViewWidth}
                                       widthChangedFunc={this.treeViewWidthChanged} />
                    <div id="content" style={contentStyle}>
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
                <Alert />
            </div>
        );
    }

    treeViewWidthChanged(width) {

        if (width < this.minWidth) {
            width = 0;
        }

        this.setState(
            {
                treeViewWidth: width
            }
        );
    }

    componentDidMount() {

        window.addEventListener('popstate', function(event) {
            ManifestHistory.goBack();
        });
    }

}

export default App;
