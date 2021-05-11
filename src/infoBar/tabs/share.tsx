import React, {useContext} from "react";
import {getLocalized} from "../../lib/ManifestHelpers";
import IIIFIcon from "../../icons/IIIFIcon";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faAt} from "@fortawesome/free-solid-svg-icons";
import {faFacebookF, faTwitter} from "@fortawesome/free-brands-svg-icons";

import "./share.css";
import {AppContext} from "../../AppContext";




export default function Share() {

    const {currentManifest} = useContext(AppContext);
    if (!currentManifest) {
        return <></>;
    }
    const title = getLocalized(currentManifest.label);
    const encodedUrl = encodeURI(window.location.href);
    const twitterUrl = 'https://twitter.com/intent/tweet?text=' + title + ': ' + encodedUrl;
    const facebookUrl = 'https://www.facebook.com/sharer.php?u=' + encodedUrl;

    return <div className="aiiif-share-button-group">
        <a target="_blank" rel="noopener noreferrer" href={currentManifest.id}
           className="aiiif-share-button-iiif">
            <IIIFIcon />
        </a>

        <a href={"mailto:?subject=" + title + "&body=" + window.location.href}
           className="aiiif-share-button-email">
            <FontAwesomeIcon icon={faAt} />
        </a>

        <a target="_blank" rel="noopener noreferrer" href={facebookUrl}
           className="aiiif-share-button-facebook">
            <FontAwesomeIcon icon={faFacebookF} />
        </a>

        <a href={twitterUrl} target="_blank" rel="noopener noreferrer"
           className="aiiif-share-button-twitter">
            <FontAwesomeIcon icon={faTwitter} />
        </a>
    </div>;
}
