import IManifestDataThumbnail from './IManifestDataThumbnail';
import {LabelValuePair, PropertyValue} from "manifesto.js";
import ITranscription from "./ITranscription";

interface IManifestData {
    id: string;
    request?: string;
    type: string;
    label: PropertyValue;
    logo: string | null;
    attribution: LabelValuePair | null;
    manifestations: any;
    parentId?: string;
    collections: IManifestReference[];
    manifests: IManifestReference[];
    resource: any;
    restricted: boolean;
    metadata: LabelValuePair[];
    license: string | null;
    search?: ISearchService
    description: PropertyValue;
    thumbnail?: IManifestDataThumbnail;
    authService?: IAuthService;
    transcription: ITranscription[];
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


export default IManifestData;
