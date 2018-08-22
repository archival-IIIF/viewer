import React from "react";
import OpenSeadragonLoader from "openseadragon"


class OpenSeadragon extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            source: props.source,
        };
    }

    render() {

        return <div id="openseadragon" key={this.state.source}>
            <div id="zoom-in-button" className="openseadragon-icon" />
            <div id="zoom-out-button" className="openseadragon-icon" />
            <div id="rotate-right-button" className="openseadragon-icon" />
            <div id="home-button" className="openseadragon-icon" />
            <div id="fullpage-button" className="openseadragon-icon" />
        </div>
    }


    componentDidMount() {

        let options = {
            id: "openseadragon",
            defaultZoomLevel: 0,
            tileSources: [this.state.source],
            showNavigationControl: true,
            showNavigator: true,
            showRotationControl: true,
            maxZoomPixelRatio: 2,
            controlsFadeDelay: 250,
            controlsFadeLength: 250,
            navigatorPosition: "BOTTOM_RIGHT",
            animationTime:  1.2,
            visibilityRatio:  0.5,
            blendTime:  0,
            zoomInButton: "zoom-in-button",
            zoomOutButton: "zoom-out-button",
            homeButton: "home-button",
            fullPageButton: "fullpage-button",
            rotateRightButton: "rotate-right-button",
            ajaxWithCredentials: false
        };

        if (global.token !== "") {
            options.ajaxHeaders = {
                'Authorization': 'Bearer ' + global.token
            }
        }

        OpenSeadragonLoader(options);
    }

    componentWillUnmount() {
    }

}

export default OpenSeadragon;