import * as React from 'react';
import * as OpenSeadragonLoader from 'openseadragon';
import InfoJson from './lib/InfoJson';
import Cache from './lib/Cache';

interface IProps {
    source: string;
}


class OpenSeadragon extends React.Component<IProps, any> {

    private tokenReceived = this.update.bind(this);

    constructor(props) {

        super(props);

        this.state = {
            source: props.source,
            spinner: true,
        };
    }

    render() {

        let spinner = <div />;
        if (this.state.spinner) {
            spinner = <div id="spinner" className="lds-ripple" style={{top: this.getWindowHeight() / 4 + 32}}>
                <div /><div />
            </div>;
        }

        return <div id="openseadragon" key={this.state.source} style={{height: this.getWindowHeight() / 2}}>
            <div id="zoom-in-button" className="openseadragon-icon" />
            <div id="zoom-out-button" className="openseadragon-icon" />
            <div id="rotate-right-button" className="openseadragon-icon" />
            <div id="home-button" className="openseadragon-icon" />
            <div id="fullpage-button" className="openseadragon-icon" />
            {spinner}
        </div>;
    }


    componentDidMount() {
        const t = this;
        InfoJson.get(this.state.source, function(data) {
            const options = {
                id: 'openseadragon',
                defaultZoomLevel: 0,
                tileSources: data,
                showNavigationControl: true,
                showNavigator: true,
                showRotationControl: true,
                maxZoomPixelRatio: 2,
                controlsFadeDelay: 250,
                controlsFadeLength: 250,
                navigatorPosition: 'BOTTOM_RIGHT',
                animationTime:  1.2,
                visibilityRatio:  0.5,
                blendTime:  0,
                zoomInButton: 'zoom-in-button',
                zoomOutButton: 'zoom-out-button',
                homeButton: 'home-button',
                fullPageButton: 'fullpage-button',
                rotateRightButton: 'rotate-right-button',
                ajaxWithCredentials: false
            };

            if (Cache.token !== '') {
                options['ajaxHeaders'] = {
                    Authorization: 'Bearer ' + Cache.token
                };
            }

            t['viewer'] = OpenSeadragonLoader(options);
            t['viewer'].addHandler('tile-drawn', () => {
                t.setState({
                    spinner: false
                });
            });
        });

        Cache.ee.addListener('token-received', this.tokenReceived);
    }

    update() {
        this['viewer'].forceRedraw();
    }

    componentWillUnmount() {
        this['viewer'].removeAllHandlers();
        Cache.ee.addListener('token-received', this.tokenReceived);
    }

    getWindowHeight() {
        const w = window;
        const d = document;
        const e = d.documentElement;
        const g = d.getElementsByTagName('body')[0];

        return w.innerHeight || e.clientHeight || g.clientHeight;
    }

}

export default OpenSeadragon;
