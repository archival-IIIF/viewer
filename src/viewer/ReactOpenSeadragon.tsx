import * as React from 'react';
import * as OpenSeadragon from 'openseadragon';
import InfoJson from '../lib/InfoJson';
import Cache from '../lib/Cache';
import ViewerSpinner from './ViewerSpinner';
import Token from "../lib/Token";
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import HomeIcon from '@material-ui/icons/Home';
import RotateIcon from '@material-ui/icons/RotateRight';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import NextIcon from '@material-ui/icons/NavigateNext';
import PreviousIcon from '@material-ui/icons/NavigateBefore';

interface IProps {
    source: string[];
}

interface IState {
    source: string[];
    spinner: boolean;
}

const iconStyle = {
    color: "white",
    fontSize: 32
}

class ReactOpenSeadragon extends React.Component<IProps, IState> {

    private viewer: any;
    private data: any = [];
    private i = 0;

    constructor(props: IProps) {

        super(props);

        this.state = {
            source: props.source,
            spinner: true
        };

        this.tokenReceived = this.tokenReceived.bind(this);
    }

    render() {


        return <div id="openseadragon" key={this.state.source[0]}>
            <button id="zoom-in-button" className="openseadragon-icon">
                <ZoomInIcon style={iconStyle} />
            </button>
            <button id="zoom-out-button" className="openseadragon-icon">
                <ZoomOutIcon style={iconStyle} />
            </button>
            <button id="rotate-right-button" className="openseadragon-icon">
                <RotateIcon style={iconStyle} />
            </button>
            <button id="home-button" className="openseadragon-icon">
                <HomeIcon style={iconStyle} />
            </button>
            <button id="fullpage-button" className="openseadragon-icon">
                <FullScreenIcon style={iconStyle} />
            </button>
            {this.renderPreviousButton()}
            {this.renderNextButton()}
            <ViewerSpinner show={this.state.spinner} />
            {this.renderSources()}
        </div>;
    }

    renderPreviousButton() {
        if (this.data.length > 1) {
            return <button id="previous-button" className="openseadragon-icon" disabled={(this.i === 0)}
                        onClick={() => this.changeSource(this.i - 1)}>
                <PreviousIcon style={iconStyle} />
            </button>
        }
    }

    renderNextButton() {
        if (this.data.length > 1) {
            return  <button id="next-button" className="openseadragon-icon" disabled={(this.i + 1 === this.data.length)}
                         onClick={() => this.changeSource(this.i + 1)}>
                <NextIcon style={iconStyle}/>
            </button>
        }
    }

    renderSources() {
        if (this.data.length > 1) {
            const sourceThumbs = [];
            for (let i = 0; i < this.data.length; i++) {
                const source = this.data[i];
                let id = '';
                if (source['@context'] === 'http://iiif.io/api/image/2/context.json') {
                    id = source['@id'];
                } else {
                    id = source.id;
                }
                sourceThumbs.push(
                    <img key={id} src={id+'/full/,140/0/default.jpg'} alt={id}
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

        this.initViewer();

        Cache.ee.addListener('token-received', this.tokenReceived);
    }

    tokenReceived() {
        if (this.viewer) {
            this.viewer.forceRedraw();
        }
    }

    initViewer() {
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

            if (data.authService && data.authService.token && Token.has(data.authService.token)) {
                options['ajaxHeaders'] = {
                    Authorization: 'Bearer ' + Token.get(data.authService.token)
                };
            }

            t.viewer = new OpenSeadragon.Viewer(options);
            t.viewer.addHandler('tile-drawn', () => {
                t.setState({
                    spinner: false
                });
            });
        });
    }

    componentWillUnmount() {
        if (this.viewer) {
            this.viewer.removeAllHandlers();
        }
        Cache.ee.addListener('token-received', this.tokenReceived);
    }
}

export default ReactOpenSeadragon;
