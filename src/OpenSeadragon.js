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

        return <div id="openseadragon" key={this.state.source} />
    }


    componentDidMount() {

        OpenSeadragonLoader({
            id: "openseadragon",
            preserveViewport: true,
            visibilityRatio: 1,
            minZoomLevel: 1,
            defaultZoomLevel: 1,
            sequenceMode: true,
            tileSources: [this.state.source]
        });
    }

    componentWillUnmount() {
    }

}

export default OpenSeadragon;