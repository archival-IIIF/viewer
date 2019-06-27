import * as React from 'react';

const s = require('./css/App.css');
import FolderView from './FolderView';
import FileInfo from './FileInfo';
import Viewer from './Viewer';
import TopBar from './TopBar';
import ManifestHistory from './lib/ManifestHistory';
import Login from './Login';
import TreeViewContainer from './TreeViewContainer';
import Alert from './Alert';
import {I18nextProvider} from 'react-i18next';
import i18next from 'i18next';
import IConfigParameter from './interface/IConfigParameter';
import Config from './lib/Config';
const commonEn = require('./translations/en/common.json');
const commonDe = require('./translations/de/common.json');

interface IState {
    folderAndInfoLeft?: number;
    folderAndInfoTop?: number;
    treeViewWidth: number;
}

interface IProps {
    config?: IConfigParameter;
}

declare let global: {
    config: Config;
};


class App extends React.Component<IProps, IState> {

    private minWidth: number = 60;

    constructor(props) {

        super(props);

        global.config = new Config(this.props.config);

        i18next.init({
            lng: global.config.getLanguage(),
            fallbackLng: global.config.getFallbackLanguage(),
            interpolation: { escapeValue: false },  // React already does escaping
            resources: {
                de: {
                    common: commonDe
                },
                en: {
                    common: commonEn
                }
            }
        });

        this.state = {
            treeViewWidth: global.config.getDefaultNavBarWith()
        };

        this.treeViewWidthChanged = this.treeViewWidthChanged.bind(this);
    }

    render() {

        const contentStyle = {
            left: this.state.treeViewWidth + global.config.getSplitterWidth(this.state.treeViewWidth === 0)
        };

        return (
            <I18nextProvider i18n={i18next}>
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
            </I18nextProvider>
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
