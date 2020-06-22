import * as React from 'react';
import * as OpenSeadragon from 'openseadragon';
import ImageApi from '../fetch/ImageApi';
import ViewerSpinner from './ViewerSpinner';
import Token from "../lib/Token";
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import HomeIcon from '@material-ui/icons/Home';
import RotateIcon from '@material-ui/icons/RotateRight';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import NextIcon from '@material-ui/icons/NavigateNext';
import PreviousIcon from '@material-ui/icons/NavigateBefore';
import {AnnotationType} from "../fetch/SearchApi";
import Cache from "../lib/Cache";
import i18next from 'i18next';
import './openSeadragon.css';

interface IProps {
    source: any[];
    authDate?: number;
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
    private isM = false;
    private id = Math.random();

    constructor(props: IProps) {

        super(props);

        this.state = {
            source: props.source,
            spinner: true
        };

        this.addAnnotation = this.addAnnotation.bind(this);
        this.changeLanguage = this.changeLanguage.bind(this);
    }

    render() {


        return <div id={'openseadragon-' + this.id} className="aiiif-openseadragon" key={this.state.source[0]}>
            <button id={"zoom-in-button-" + this.id} className="aiiif-openseadragon-icon aiiif-zoom-in-button">
                <ZoomInIcon style={iconStyle} />
            </button>
            <button id={"zoom-out-button-" + this.id} className="aiiif-openseadragon-icon aiiif-zoom-out-button">
                <ZoomOutIcon style={iconStyle} />
            </button>
            <button id={"rotate-right-button-" + this.id}
                    className="aiiif-openseadragon-icon aiiif-rotate-right-button">
                <RotateIcon style={iconStyle} />
            </button>
            <button id={"home-button-" + this.id} className="aiiif-openseadragon-icon aiiif-home-button">
                <HomeIcon style={iconStyle} />
            </button>
            <button id={"fullpage-button-" + this.id} className="aiiif-openseadragon-icon aiiif-fullpage-button">
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
            return <button className="aiiif-openseadragon-icon aiiif-previous-button" disabled={(this.i === 0)}
                        onClick={() => this.changeSource(this.i - 1)} title={i18next.t('common:previousPage')}>
                <PreviousIcon style={iconStyle} />
            </button>
        }
    }

    renderNextButton() {
        if (this.data.length > 1) {
            return <button className="aiiif-openseadragon-icon aiiif-next-button"
                           disabled={(this.i + 1 === this.data.length)}
                           onClick={() => this.changeSource(this.i + 1)} title={i18next.t('common:nextPage')}>
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

            return <div className="aiiif-sources">{sourceThumbs}</div>
        }
    }

    changeSource(i: number) {
        const t = this;
        this.viewer.clearOverlays();

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

    initViewer() {
        const t = this;
        return;
        ImageApi.getMulti(this.state.source, function(data: any) {

            if (!t.isM) {
                return;
            }

            if (data[0] && data[0].statusCode === 401) {
                t.viewer = undefined;
                t.setState({
                    spinner: false
                });
                return;
            }


            t.data = data;
            const options: any = {
                id: 'openseadragon-' + t.id,
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
                zoomInButton: 'zoom-in-button-'+ t.id,
                zoomOutButton: 'zoom-out-button-'+ t.id,
                homeButton: 'home-button-'+ t.id,
                fullPageButton: 'fullpage-button-'+ t.id,
                rotateRightButton: 'rotate-right-button-'+ t.id,
                ajaxWithCredentials: false
            };

            if (data.authService && data.authService.token && Token.has(data.authService.token)) {
                options['ajaxHeaders'] = {
                    Authorization: 'Bearer ' + Token.get(data.authService.token)
                };
            }

            OpenSeadragon.setString("Tooltips.Home", i18next.t('common:zoomReset'));
            OpenSeadragon.setString("Tooltips.ZoomOut",i18next.t('common:zoomOut'));
            OpenSeadragon.setString("Tooltips.ZoomIn",  i18next.t('common:zoomIn'));
            OpenSeadragon.setString("Tooltips.FullPage",  i18next.t('common:toggleFullScreen'));
            OpenSeadragon.setString("Tooltips.RotateRight",  i18next.t('common:rotateRight'));

            t.viewer = new OpenSeadragon.Viewer(options);
            t.viewer.addHandler('tile-drawn', () => {
                t.setState({
                    spinner: false
                });
            });
        });
    }

    addAnnotation(annotation: AnnotationType) {

        const index: any = this.props.source.findIndex((s: any) => s.on === annotation.on);
        if (index < 0) {
            return;
        }

        if (index !== this.i) {
            this.changeSource(index);
        } else {
            this.viewer.clearOverlays();
        }

        const elt = document.createElement("div");
        elt.className = "aiiif-highlight";
        const imageWidth = this.props.source[index].width;
        this.viewer.addOverlay({
            element: elt,
            location: new OpenSeadragon.Rect(
                annotation.x/imageWidth,
                annotation.y/imageWidth,
                annotation.width/imageWidth,
                annotation.height/imageWidth)
        });
    }


    changeLanguage(lng: string) {
        if (this.viewer) {
            this.viewer.removeAllHandlers('tile-drawn');
        }
        this.initViewer();
    }

    componentDidMount() {
        this.isM = true;
        this.initViewer();
        Cache.ee.addListener('annotation-changed', this.addAnnotation);
        i18next.on('languageChanged', this.changeLanguage);
    }

    componentWillUnmount() {
        this.isM = false;
        if (this.viewer) {
            this.viewer.removeAllHandlers('tile-drawn');
        }
        Cache.ee.removeListener('annotation-changed', this.addAnnotation);
        i18next.off('languageChanged', this.changeLanguage);

    }
}

export default ReactOpenSeadragon;
