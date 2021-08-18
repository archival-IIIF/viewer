import React, {useContext} from "react";
import TabButton from "./TabButton";
import {faDownload, faInfoCircle, faSearch, faShare, faImages} from "@fortawesome/free-solid-svg-icons";
import Config from "../lib/Config";
import {ServiceProfile} from "@iiif/vocabulary";
import {AppContext} from "../AppContext";


declare let global: {
    config: Config;
};

export default function TabButtons() {

    const {currentManifest, tab, setTab} = useContext(AppContext);

    if (!currentManifest) {
        return <></>;
    }

    const buttons = [];

    buttons.push(
        <TabButton key="metadata" icon={faInfoCircle} name="metadata" active={tab === 'metadata'}
                   setTab={setTab} />
    );

    if (currentManifest.images.length > 0) {
        buttons.push(
            <TabButton key="pages" icon={faImages} name="pages" active={tab === 'pages'}
                       setTab={setTab} />
        );
    }


    if (currentManifest.search) {
        buttons.push(
            <TabButton key="search" icon={faSearch} name="search" active={tab === 'search'}
                       setTab={setTab} />
        );
    }


    if (
        !global.config.getDisableSharing() &&
        !currentManifest.restricted &&
        !(
            currentManifest.authService &&
            currentManifest.authService.profile !== ServiceProfile.AUTH_0_CLICK_THROUGH &&
            currentManifest.authService.profile !== ServiceProfile.AUTH_1_CLICK_THROUGH
        )
    ) {
        buttons.push(
            <TabButton key="share" icon={faShare} name={'share'} active={tab === 'share'}
                       setTab={setTab}/>
        );
    }

    if (!global.config.getDisableDownload()) {
        buttons.push(
            <TabButton key="download" icon={faDownload} name={'download'} active={tab === 'download'}
                       setTab={setTab}/>
        );
    }

    return <div className={"aiiif-button-bar"}>{buttons}</div>;
}
