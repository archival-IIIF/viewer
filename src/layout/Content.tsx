import * as React from 'react';
import Viewer from "../viewer/Viewer";
import Splitter from "../splitter/Splitter";
import {isSingleManifest} from "../lib/ManifestHelpers";
import Content2 from "./Content2";
import InfoBar from "../infoBar/infoBar";
import {useContext} from "react";
import {AppContext} from "../AppContext";
import TabButtons from "../infoBar/tabButtons";


export default function Content() {

    const {tab, currentManifest} = useContext(AppContext);

    if (!currentManifest) {
        return <></>;
    }

    if (isSingleManifest(currentManifest)) {
        return <Viewer />;
    }

    if (tab === '') {
        return <>
            <Content2 />
            <TabButtons />
        </>
    }

    return <>
            <Splitter
            id="content0"
            a={<Content2/>}
            b={<InfoBar key={currentManifest.id} />}
            aSize={80}
            direction="vertical"
        />
        <TabButtons />
    </>
}
