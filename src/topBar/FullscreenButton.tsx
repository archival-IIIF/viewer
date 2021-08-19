import * as React from 'react';
import './fullscreen.css';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExpand} from "@fortawesome/free-solid-svg-icons";
import enterFullscreen from "../lib/EnterFullscreen";

export default function FullscreenButton() {

    return <div className="aiiif-fullscreen-button">
        <button onClick={() => enterFullscreen()}>
            <FontAwesomeIcon icon={faExpand} />
        </button>
    </div>;
}
