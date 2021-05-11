import * as React from 'react';
import Viewer from "../viewer/Viewer";
import Splitter from "../splitter/Splitter";
import {isSingleManifest} from "../lib/ManifestHelpers";
import Content3 from "./Content3";
import InfoBar from "../infoBar/infoBar";
import {useContext} from "react";
import {AppContext} from "../AppContext";
import TabButtons from "../infoBar/tabButtons";


export default function Content2() {

    const {tab, currentManifest} = useContext(AppContext);

    if (!currentManifest) {
        return <></>;
    }

    if (isSingleManifest(currentManifest)) {
        return <Viewer />;
    }

    if (tab === '') {
        return <>
            <Content3 />
            <TabButtons />
        </>
    }

    return <>
            <Splitter
            id="content0"
            a={<Content3/>}
            b={<InfoBar key={currentManifest.id} />}
            aSize={80}
            direction="vertical"
        />
        <TabButtons />
    </>
}
