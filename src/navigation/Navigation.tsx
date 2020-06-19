import * as React from 'react';
import './search.css';
import Search from "./Search";
import TreeView from "./treeView/TreeView";
import IManifestData, {ISearchService} from "../interface/IManifestData";
import ITree from "../interface/ITree";
import TreeIcon from "@material-ui/icons/AccountTree";
import SearchIcon from "@material-ui/icons/Search";


interface IState {
    view: string;
}

interface IState {
    view: string;
}

interface IProps {
    currentFolder: IManifestData;
    currentManifest: IManifestData;
    tree?: ITree;
    q: string | null;
    setCurrentManifest: (id?: string) => void;
}

export default class Navigation extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {view: (this.props.q || !this.props.currentManifest.parentId) ? 'search' : 'tree'};

        this.setView = this.setView.bind(this);
    }

    render() {
        if (!this.props.currentManifest.search) {
            return <div className="aiiif-navigation">
                <TreeView
                    currentFolderId={this.props.currentFolder.id}
                    tree={this.props.tree}
                    setCurrentManifest={this.props.setCurrentManifest}
                />
            </div>;
        }

        return <div className="aiiif-navigation">
            <div className="aiiif-navigation-bar">
                <TreeIcon onClick={() => this.setView('tree')}>Tree</TreeIcon>
                <SearchIcon onClick={() => this.setView('search')}>Search</SearchIcon>
            </div>

            {this.renderView(this.props.currentManifest.search)}
        </div>;
    }

    renderView(searchService: ISearchService) {
        if (this.state.view === 'tree') {
            return <TreeView
                currentFolderId={this.props.currentFolder.id}
                tree={this.props.tree}
                setCurrentManifest={this.props.setCurrentManifest}
            />
        }

        return <Search searchService={searchService} q={this.props.q}/>
    }

    setView(view: string) {
        this.setState({view});
    }
}
