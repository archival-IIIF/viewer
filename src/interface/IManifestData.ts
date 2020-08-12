import IManifestDataThumbnail from './IManifestDataThumbnail';
import {LabelValuePair, LanguageMap} from "manifesto.js";
import ITranscription from "./ITranscription";

interface IManifestData {
    id: string;
    request?: string;
    type: string;
    label: LanguageMap;
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
    description: LanguageMap;
    thumbnail?: IManifestDataThumbnail;
    authService?: IAuthService;
    transcription: ITranscription[];
}

export interface IManifestReference {
    id: string;
    label: LanguageMap;
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
    autoComplete?: string;
}


export default IManifestData;
