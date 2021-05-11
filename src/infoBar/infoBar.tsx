import React from "react";
import "./infoBar.css";
import Tabs from "./tabs";


export default function InfoBar() {

    /*const keyDown = function(event: KeyboardEvent) {
        if (event.key === 'ArrowLeft') {
            previousPage();
            return;
        }

        if (event.key === 'ArrowRight') {
            nextPage();
            return;
        }

        if (props.presentation.searchService && (event.ctrlKey|| event.metaKey) && event.key === 'f') {
            event.preventDefault();
            props.setTab('search');
            return;
        }
    }*/



    /*useEffect(() => {
        document.addEventListener("keydown", keyDown, false);
        return () => {
            document.removeEventListener('keydown', keyDown, false);
        };
    });*/

    return <div className="aiiif-infobar">
        <Tabs />
    </div>;
}
