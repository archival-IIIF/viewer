import IManifestDataThumbnail from './IManifestDataThumbnail';

interface IManifestData {
    id: string;
    key: string;
    type: string;
    label: string;
    logo: string | null;
    attribution: string;
    manifestations: any;
    parentId?: string;
    collections: any;
    manifests: any;
    resource: any;
    restricted: boolean;
    metadata: any;
    license?: string;
    description: string;
    thumbnail?: IManifestDataThumbnail;
    authService?: IAuthService;
}

export interface IAuthService {
    id: string;
    token?: string;
    logout?: string;
    profile: string;
    confirmLabel?: string;
    description?: string;
    errorMessage?: string;
    header?: string;
    failureHeader?: string;
}


export default IManifestData;
