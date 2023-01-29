import IManifestDataThumbnail from './IManifestDataThumbnail';
import {LabelValuePair, PropertyValue, Service} from "manifesto.js";
import ITranscription from "./ITranscription";

export default interface IManifestData {
    id: string;
    request?: string;
    type: string;
    metadata: LabelValuePair[];
    authService?: IAuthService;
    label: PropertyValue;
    logo: string | null;
    attribution: LabelValuePair | null;
    manifestations: any;
    seeAlso?: ISeeAlso[];
    parentId?: string;
    collections: IManifestReference[];
    manifests: IManifestReference[];
    resource?: IPresentationApiResource;
    itemsType: IPresentationApiItemsType;
    restricted: boolean;
    license: string | null;
    search?: ISearchService
    description: PropertyValue;
    thumbnail?: IManifestDataThumbnail;
    transcription: ITranscription[];
    images: IPresentationApiImage[];
    services?: Service[];
    homepages?: IHomepage[];
}

export type IPresentationApiItemsType = 'image' | 'audioVideo' | 'pdf' | 'file' | 'plain' | 'html';

export interface IPresentationApiImage {
    id: string;
    width: number;
    height: number;
    on: string;
    format: string;
}

export interface IPresentationApiResource {
    id: string;
    format: string;
    type: string;
    manifestations?: IPresentationApiManifestation[];
}

export interface IPresentationApiManifestation {
    label: PropertyValue;
    url: string;
}


export interface IManifestReference {
    id: string;
    label: PropertyValue;
    thumbnail?: IManifestDataThumbnail;
    type: string;
}

export interface IAuthService {
    id: string;
    token?: string;
    logout?: string;
    profile: string;
    confirmLabel: string | null;
    description: string | null;
    errorMessage: string | null;
    header: string | null;
    failureHeader: string | null;
}

export interface ISearchService {
    id: string;
    autoCompleteId?: string;
}

export interface ISeeAlso {
    id: string;
    label?: PropertyValue;
}

export interface IHomepage {
    id: string;
    label: PropertyValue;
    type: string;
    format?: string;
}
