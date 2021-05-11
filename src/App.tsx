import React, {useState, useEffect} from 'react';
import TopBar from './TopBar/TopBar';
import ManifestHistory from './lib/ManifestHistory';
import Login from './Login';
import Alert from './Alert';
import {I18nextProvider} from 'react-i18next';
import i18n  from 'i18next';
import IConfigParameter from './interface/IConfigParameter';
import Config from './lib/Config';
import Splitter from "./splitter/Splitter";
import Content from "./layout/Content";
import './css/App.css';
import Cache from "./lib/Cache";
import IManifestData from "./interface/IManifestData";
import PresentationApi from "./fetch/PresentationApi";
import TreeBuilder from "./navigation/treeView/TreeBuilder";
import ManifestData from "./entity/ManifestData";
import Navigation from "./navigation/Navigation";
import {getLocalized, isSingleManifest} from "./lib/ManifestHelpers";
import './lib/i18n';
import {AppContext} from "./AppContext";
import {AnnotationType} from "./fetch/SearchApi";

interface IProps {
    config: IConfigParameter;
}

declare let global: {
    config: Config;
};


export default function App(props: IProps) {

    Cache.ee.setMaxListeners(100);
    global.config = new Config(props.config);


    const [currentManifest, setCurrentManifest] = useState<IManifestData | undefined>(undefined);
    const [currentFolder, setCurrentFolder] = useState<IManifestData | undefined>(undefined);
    const [treeDate, setTreeDate] = useState<number>(Date.now());
    const [authDate, setAuthDate] = useState<number>(0);
    const [tab, setTab] = useState<string>('metadata');
    const [page, setPage] = useState<number>(0);
    const [annotation, setAnnotation] = useState<AnnotationType | undefined>(undefined);
    const q = PresentationApi.getGetParameter('q', window.location.href);

    const setCurrentManifest0 = (id?: string) => {

        if (!id) {
            id = PresentationApi.getIdFromCurrentUrl();
        }
        if (!id) {
            return;
        }
        const url = id;

        PresentationApi.get(
            url,
            (currentManifest: IManifestData) =>  {
                ManifestHistory.pageChanged(
                    currentManifest.request ?? currentManifest.id,
                    getLocalized(currentManifest.label)
                );

                if (currentManifest.type === 'Collection') {
                    const currentFolder = currentManifest;
                    setCurrentManifest(currentManifest);
                    setCurrentFolder(currentFolder);
                    setPage(0);
                    TreeBuilder.buildCache(currentFolder.id, () => {
                        setTreeDate(Date.now());
                    });
                } else if (!isSingleManifest(currentManifest)) {
                    PresentationApi.get(
                        currentManifest.parentId,
                        (currentFolder: IManifestData) => {
                            setCurrentManifest(currentManifest);
                            setCurrentFolder(currentFolder);
                            setPage(0);
                            TreeBuilder.buildCache(currentFolder.id, () => {
                                setTreeDate(Date.now());
                            });
                        }
                    )
                } else {
                    const currentFolder = new ManifestData();
                    currentFolder.type = 'Manifest';
                    setCurrentManifest(currentManifest);
                    setCurrentFolder(currentFolder);
                }

                document.title = getLocalized(currentManifest.label);
            }
        );
    }



    useEffect(() => {
        const tokenReceived = () => {
            setAuthDate(Date.now());
            setCurrentManifest0();
        }

        const refresh = () => {
            setCurrentManifest0();
        }

        Cache.ee.addListener('token-changed', tokenReceived);
        i18n.changeLanguage(global.config.getLanguage());
        i18n.options.fallbackLng = global.config.getFallbackLanguage();
        i18n.on('languageChanged', refresh);

        window.addEventListener('popstate', function(event) {
            const backId = ManifestHistory.goBack();
            if (backId) {
                setCurrentManifest0(backId)
            }
        });

        setCurrentManifest0();

        return () => {
            Cache.ee.removeListener('token-changed', tokenReceived);
            i18n.off('languageChanged', refresh);
        }
    }, []);

    return <AppContext.Provider value={{treeDate, tab, setTab, page, setPage, currentManifest,
        setCurrentManifest: setCurrentManifest0, currentFolder, setCurrentFolder, authDate, setAuthDate, annotation,
        setAnnotation}}>
        <I18nextProvider i18n={i18n}>
            <Alert />
            <Login />
            <TopBar key={authDate} />
            {(!currentManifest || !currentFolder) ?
                <></> :
                <Splitter
                    id="main"
                    a={<Navigation
                        q={q}
                    />}
                    b={<Content
                        key={currentManifest.id}
                    />}
                    direction="vertical"
                />
            }
        </I18nextProvider>
    </AppContext.Provider>;
}
