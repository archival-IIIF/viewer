import * as React from 'react';
import * as OpenSeadragon from 'openseadragon';
import InfoJson from '../lib/InfoJson';
import Cache from '../lib/Cache';
import ViewerSpinner from './ViewerSpinner';

interface IProps {
    source: string[];
}

interface IState {
    source: string[];
    spinner: boolean;
}


class ReactOpenSeadragon extends React.Component<IProps, IState> {

    private tokenReceived = this.update.bind(this);
    private viewer: any;
    private data: any = [];
    private i = 0;

    constructor(props: IProps) {

        super(props);

        this.state = {
            source: props.source,
            spinner: true
        };
    }

    render() {
        return <div id="openseadragon" key={this.state.source[0]}>
            <div id="zoom-in-button" className="openseadragon-icon" />
            <div id="zoom-out-button" className="openseadragon-icon" />
            <div id="rotate-right-button" className="openseadragon-icon" />
            <div id="home-button" className="openseadragon-icon" />
            <div id="fullpage-button" className="openseadragon-icon" />
            {this.renderPreviousButton()}
            {this.renderNextButton()}
            <ViewerSpinner show={this.state.spinner} />
            {this.renderSources()}
        </div>;
    }

    renderPreviousButton() {
        if (this.data.length > 1 && this.i > 0) {
            return <div id="previous-button" className="openseadragon-icon"
                        onClick={() => this.changeSource(this.i - 1)} />
        }
    }

    renderNextButton() {
        if (this.data.length > 1 && this.i + 1 < this.data.length) {
            return  <div id="next-button" className="openseadragon-icon"
                         onClick={() => this.changeSource(this.i + 1)} />
        }
    }

    renderSources() {
        if (this.data.length > 1) {
            const sourceThumbs = [];
            for (let i = 0; i < this.data.length; i++) {
                const source = this.data[i];
                sourceThumbs.push(
                    <img key={source['@id']} src={source['@id']+'/full/,140/0/default.jpg'} alt={source['@id']}
                    onClick={() => this.changeSource(i)}/>
                );
            }

            return <div id="sources">{sourceThumbs}</div>
        }
    }

    changeSource(i: number) {
        const t = this;

        if (this.data.hasOwnProperty(i)) {
            const oldImage = this.viewer.world.getItemAt(0);
            this.viewer.addTiledImage({
                tileSource: this.data[i],
                success: function() {
                    t.viewer.world.removeItem(oldImage);
                }
            });
            this.i = i;
        }
    }


    componentDidMount() {
        const t = this;

        InfoJson.getMulti(this.state.source, function(data: any) {
            t.data = data;
            const options: any = {
                id: 'openseadragon',
                defaultZoomLevel: 0,
                tileSources: data[0],
                showNavigationControl: true,
                showNavigator: data.length === 1,
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
