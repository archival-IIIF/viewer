import React, {useState} from 'react';
import './search.css';
import Search from "./Search";
import TreeView from "./treeView/TreeView";
import IManifestData, {ISearchService} from "../interface/IManifestData";
import ITree from "../interface/ITree";
import TreeIcon from "@material-ui/icons/AccountTree";
import SearchIcon from "@material-ui/icons/Search";
import FileInfo from "../fileInfo/FileInfo";
import {isSingleManifest} from "../lib/ManifestHelpers";

interface IProps {
    currentFolder: IManifestData;
    currentManifest: IManifestData;
    tree?: ITree;
    q: string | null;
    setCurrentManifest: (id?: string) => void;
}

export default function Navigation(props: IProps) {

    const [view, setView] = useState<string>((props.q || !props.currentManifest.parentId) ? 'search' : 'tree');


    if (isSingleManifest(props.currentManifest)) {
        return <FileInfo currentManifest={props.currentManifest} />;
    }

    if (!props.currentManifest.search) {
        return <div className="aiiif-navigation">
            <TreeView
                currentFolderId={props.currentFolder.id}
                tree={props.tree}
                setCurrentManifest={props.setCurrentManifest}
            />
        </div>;
    }


    return <div className="aiiif-navigation">
        <div className="aiiif-navigation-bar">
            <TreeIcon onClick={() => setView('tree')}>Tree</TreeIcon>
            <SearchIcon onClick={() => setView('search')}>Search</SearchIcon>
        </div>

        {view === 'tree' ?
            <TreeView
                currentFolderId={props.currentFolder.id}
                tree={props.tree}
                setCurrentManifest={props.setCurrentManifest}
            /> :
            <Search searchService={props.currentManifest.search} q={props.q}/>
        }
    </div>;
}
