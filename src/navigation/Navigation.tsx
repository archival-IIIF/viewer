import React, {useState} from 'react';
import './search.css';
import Search from "./Search";
import TreeView from "./treeView/TreeView";
import IManifestData from "../interface/IManifestData";
import TreeIcon from "@material-ui/icons/AccountTree";
import SearchIcon from "@material-ui/icons/Search";
import FileInfo from "../fileInfo/FileInfo";
import {isSingleManifest} from "../lib/ManifestHelpers";

interface IProps {
    currentFolder: IManifestData;
    currentManifest: IManifestData;
    q: string | null;
    setCurrentManifest: (id?: string) => void;
}

export default function Navigation(props: IProps) {

    const [view, setView] = useState<string>((props.q || !props.currentManifest.parentId) ? 'search' : 'tree');

    const a = isSingleManifest(props.currentManifest) ?
        <FileInfo currentManifest={props.currentManifest} /> :
        <TreeView
            currentFolderId={props.currentFolder.id}
            setCurrentManifest={props.setCurrentManifest}
        />


    if (!props.currentManifest.search) {
        return <div className="aiiif-navigation">
            {a}
        </div>;
    }


    return <div className="aiiif-navigation">
        <div className="aiiif-navigation-bar">
            <TreeIcon onClick={() => setView('tree')}>Tree</TreeIcon>
            <SearchIcon onClick={() => setView('search')}>Search</SearchIcon>
        </div>

        {view === 'tree' ?
            <>{a}</> :
            <Search searchService={props.currentManifest.search} q={props.q}/>
        }
    </div>;
}
