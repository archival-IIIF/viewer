import React, {useContext, useEffect} from "react";
import "./infoBar.css";
import Tabs from "./Tabs";
import {AppContext} from "../AppContext";


export default function InfoBar() {

    const {page, setPage, currentManifest, setTab} = useContext(AppContext);
    useEffect(() => {
        document.addEventListener("keydown", keyDown, false);
        return () => {
            document.removeEventListener('keydown', keyDown, false);
        };
    });

    if (!currentManifest) {
        return <></>;
    }

    const keyDown = function(event: KeyboardEvent) {

        if (event.key === 'ArrowLeft' && page > 0) {
            setPage(page - 1);
            return;
        }

        if (event.key === 'ArrowRight' && (page + 1) < currentManifest?.images.length) {
            setPage(page + 1);
            return;
        }

        if (currentManifest.search && (event.ctrlKey|| event.metaKey) && event.key === 'f') {
            event.preventDefault();
            setTab('search');
            return;
        }
    }


    return <div className="aiiif-infobar">
        <Tabs />
    </div>;
}
