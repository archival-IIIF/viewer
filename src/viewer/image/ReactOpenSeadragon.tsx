import React, {useRef, useEffect, useState} from 'react';
import * as OpenSeadragon from 'openseadragon';
import ImageApi from '../../fetch/ImageApi';
import ViewerSpinner from '../ViewerSpinner';
import Token from "../../lib/Token";
import {AnnotationType} from "../../fetch/SearchApi";
import Cache from "../../lib/Cache";
import i18next from 'i18next';
import './openSeadragon.css';
import {Options, Viewer} from "openseadragon";
import ImageButtons from "./ImageButtons";

interface IProps {
    source: any[];
    authDate?: number;
}

const buttons = [
    {
        id: 'home',
        t: 'common:zoomReset'
    },
    {
        id: 'zoom-in',
        t: 'common:zoomIn'
    },
    {
        id: 'zoom-out',
        t: 'common:zoomOut'
    },
    {
        id: 'fullpage',
        t: 'common:toggleFullScreen'
    },
    {
        id: 'rotate-right',
        t: 'common:rotateRight'
    }
]

export default function ReactOpenSeadragon(props: IProps) {

    const viewer = useRef<Viewer | undefined | null>(undefined);
    const id = useRef<number>(Math.random());
    const data = useRef<any[]>([]);
    const j = useRef<number>(0);


    const [spinner, setSpinner] = useState<boolean>(true);
    const [showButtons, setShowButtons] = useState<boolean>(true);


    const changeSource = (n: number) => {

        if (!viewer.current) {
            return;
        }


        viewer.current.clearOverlays();

        if (data.current.hasOwnProperty(n)) {
            const oldImage = viewer.current.world.getItemAt(0);
            viewer.current.addTiledImage({
                tileSource: data.current[n],
                success: function() {
                    viewer.current?.world.removeItem(oldImage);
                }
            });
            j.current = n;
        }
    }

    // init viewer
    useEffect(() => {
        if(viewer.current !== undefined) {
            return;
        }

        viewer.current = null;

        ImageApi.getMulti(props.source, function(result: any) {

            if (result[0] && result[0].statusCode === 401) {
                viewer.current = undefined;
                return;
            }

            data.current = result;
            const options: Options = {
                id: 'openseadragon-' + id.current,
                defaultZoomLevel: 0,
                tileSources: result[0],
                showNavigationControl: true,
                showNavigator: result.length === 1,
                showRotationControl: true,
                maxZoomPixelRatio: 2,
                controlsFadeDelay: 250,
                controlsFadeLength: 250,
                navigatorPosition: 'BOTTOM_RIGHT',
                animationTime:  1.2,
                visibilityRatio:  0.5,
                blendTime:  0,
                zoomInButton: 'zoom-in-button-'+ id.current,
                zoomOutButton: 'zoom-out-button-'+ id.current,
                homeButton: 'home-button-'+ id.current,
                fullPageButton: 'fullpage-button-'+ id.current,
                rotateRightButton: 'rotate-right-button-'+ id.current,
                ajaxWithCredentials: false,
                minZoomLevel: 0.3
            };

            if (result.authService && result.authService.token && Token.has(result.authService.token)) {
                options['ajaxHeaders'] = {
                    Authorization: 'Bearer ' + Token.get(result.authService.token)
                };
            }

            OpenSeadragon.setString("Tooltips.Home", i18next.t('common:zoomReset'));
            OpenSeadragon.setString("Tooltips.ZoomOut",i18next.t('common:zoomOut'));
            OpenSeadragon.setString("Tooltips.ZoomIn",  i18next.t('common:zoomIn'));
            OpenSeadragon.setString("Tooltips.FullPage",  i18next.t('common:toggleFullScreen'));
            OpenSeadragon.setString("Tooltips.RotateRight",  i18next.t('common:rotateRight'));

            viewer.current = new OpenSeadragon.Viewer(options);
            viewer.current.addHandler('tile-drawn', () => {
                setSpinner(false);
            });
        });
    });

    useEffect(() => {

        const changeLanguage = () => {
            for (const b of buttons) {
                const element = document.getElementById(b.id + '-button-' + id.current.toString());
                console.log(element, i18next.t(b.t));
                if (element) {
                    element.title = i18next.t(b.t);
                }
            }
        }

        const addAnnotation = (annotation: AnnotationType) => {

            if (!viewer.current) {
                return;
            }

            const index: any = props.source.findIndex((s: any) => s.on === annotation.on);
            if (index < 0) {
                return;
            }

            if (index !== j.current) {
                changeSource(index);
            } else {
                viewer.current.clearOverlays();
            }

            const elt = document.createElement("div");
            elt.className = "aiiif-highlight";
            const imageWidth = props.source[index].width;
            viewer.current.addOverlay({
                element: elt,
                location: new OpenSeadragon.Rect(
                    annotation.x/imageWidth,
                    annotation.y/imageWidth,
                    annotation.width/imageWidth,
                    annotation.height/imageWidth)
            });
        }

        Cache.ee.addListener('annotation-changed', addAnnotation);
        i18next.on('languageChanged', changeLanguage);

        return () => {
            if (viewer.current) {
                viewer.current.removeAllHandlers('tile-drawn');
            }
            Cache.ee.removeListener('annotation-changed', addAnnotation);
            i18next.off('languageChanged', changeLanguage);
        }
    })

    const renderSources = () => {

        if (data.current.length > 1) {
            const sourceThumbs = [];
            for (let i = 0; i < data.current.length; i++) {
                const source = data.current[i];
                let id2 = '';
                if (source['@context'] === 'http://iiif.io/api/image/2/context.json') {
                    id2 = source['@id'];
                } else {
                    id2 = source.id;
                }
                sourceThumbs.push(
                    <img key={id2} src={id2+'/full/,140/0/default.jpg'} alt={id2}
                         onClick={() => changeSource(i)}/>
                );
            }

            return <div className="aiiif-sources">{sourceThumbs}</div>
        }
    }

    return <div id={'openseadragon-' + id.current.toString()} className="aiiif-openseadragon" key={props.source[0]}
                onMouseEnter={() => setShowButtons(true)}
                onMouseLeave={() => setShowButtons(false)} >
        <ImageButtons data={data.current} viewerId={id.current} j={j.current} changeSource={changeSource} show={showButtons}/>
        <ViewerSpinner show={spinner} />
        {renderSources()}
    </div>;
}
