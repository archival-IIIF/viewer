import * as React from 'react';
import * as OpenSeadragon from 'openseadragon';
import InfoJson from './lib/InfoJson';
import Cache from './lib/Cache';
import ViewerSpinner from './ViewerSpinner';
import WindowInfo from './lib/WindowInfo';

interface IProps {
    source: string;
}

interface IState {
    source: string;
    spinner: boolean;
}


class ReactOpenSeadragon extends React.Component<IProps, IState> {

    private tokenReceived = this.update.bind(this);
    private viewer: any;

    constructor(props: IProps) {

        super(props);

        this.state = {
            source: props.source,
            spinner: true,
        };
    }

    render() {
        return <div id="openseadragon" key={this.state.source} style={{height: WindowInfo.getHeight() / 2}}>
            <div id="zoom-in-button" className="openseadragon-icon" />
            <div id="zoom-out-button" className="openseadragon-icon" />
            <div id="rotate-right-button" className="openseadragon-icon" />
            <div id="home-button" className="openseadragon-icon" />
            <div id="fullpage-button" className="openseadragon-icon" />
            <ViewerSpinner show={this.state.spinner} />
        </div>;
    }


    componentDidMount() {
        const t = this;
        InfoJson.get(this.state.source, function(data: any) {
            const options: any = {
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

            t.viewer = new OpenSeadragon.Viewer(options);
            t.viewer.addHandler('tile-drawn', () => {
                t.setState({
                    spinner: false
                });
            });
        });

        Cache.ee.addListener('token-received', this.tokenReceived);
    }

    update() {
        if (this.viewer) {
            this.viewer.forceRedraw();
        }
    }

    componentWillUnmount() {
        if (this.viewer) {
            this.viewer.removeAllHandlers();
        }
        Cache.ee.addListener('token-received', this.tokenReceived);
    }
}

export default ReactOpenSeadragon;
