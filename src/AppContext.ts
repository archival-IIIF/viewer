import React from 'react';
import IManifestData from "./interface/IManifestData";
import {AnnotationType, HitType} from "./fetch/SearchApi";

interface IContext {
    treeDate: number;
    tab: string;
    setTab: (tab: string) => void;
    page: number;
    setPage: (currentPage: number) => void;
    currentManifest: IManifestData | undefined;
    setCurrentManifest: (id?: string) => void;
    currentFolder: IManifestData | undefined;
    setCurrentFolder: (manifest: IManifestData | undefined) => void;
    authDate: number;
    setAuthDate: (authDate: number) => void;
    currentAnnotation: AnnotationType | undefined;
    setCurrentAnnotation: (annotation: AnnotationType | undefined) => void;
    searchResult: HitType[];
    setSearchResult: (annotation: HitType[]) => void;
}

export const AppContext = React.createContext<IContext>({
    treeDate: 0,
    tab: '',
    setTab: () => {},
    page: 0,
    setPage: () => {},
    currentManifest: undefined,
    setCurrentManifest: () => {},
    currentFolder: undefined,
    setCurrentFolder: () => {},
    authDate: 0,
    setAuthDate: () => {},
    currentAnnotation: undefined,
    setCurrentAnnotation: () => {},
    searchResult: [],
    setSearchResult: () => {}
});
