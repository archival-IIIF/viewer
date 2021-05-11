import React, {useContext} from 'react';
import '../infoBar/tabs/search.css';
import TreeView from "./treeView/TreeView";
import {isSingleManifest} from "../lib/ManifestHelpers";
import InfoBar from "../infoBar/infoBar";
import {AppContext} from "../AppContext";
import TabButtons from "../infoBar/tabButtons";

interface IProps {
    q: string | null;
}

export default function Navigation(props: IProps) {

    const {currentManifest} = useContext(AppContext);

    if (!currentManifest) {
        return <></>;
    }

    return <div className="aiiif-navigation">
        {isSingleManifest(currentManifest) ?
            <div className="aiiif-infobar">
                <TabButtons />
                <InfoBar />
            </div> :
            <TreeView />}
    </div>;
}
