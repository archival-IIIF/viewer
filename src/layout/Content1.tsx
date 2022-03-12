import * as React from 'react';
import Splitter from "../splitter/Splitter";
import Content2 from "./Content2";
import {useContext} from "react";
import {AppContext} from "../AppContext";
import {isSingleManifest, isSingleRoot} from "../lib/ManifestHelpers";
import TabButtons from "../infoBar/TabButtons";
import InfoBar from "../infoBar/InfoBar";
import TreeView from "../treeView/TreeView";
import Content3 from "./Content3";
import Config from "../lib/Config";

declare let global: {
    config: Config;
};

export default function Content1() {

    const {currentManifest, tab, currentFolder} = useContext(AppContext);

    if (!currentManifest || !currentFolder) {
        return <></>;
    }

    if (
        isSingleManifest(currentManifest) ||
        (global.config.getHideUnbranchedTrees() && isSingleRoot(currentFolder))
    ) {
        if (tab === '') {
            return <>
                <div className="aiiif-infobar">
                    <TabButtons />
                    <Content3 key={currentManifest.id}/>
                </div>
            </>;
        }

        return <Splitter
            id="main"
            a={<div className="aiiif-navigation">
                <div className="aiiif-infobar">
                    <TabButtons />
                    <InfoBar />
                </div>
            </div>}
            b={<Content2 key={currentManifest.id}/>}
            direction="vertical"
        />;
    }

    return <Splitter
        id="main"
        a={<div className="aiiif-navigation"><TreeView /></div>}
        b={<Content2 />}
        direction="vertical"
    />;
}
