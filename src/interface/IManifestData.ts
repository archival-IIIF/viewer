import IManifestDataThumbnail from './IManifestDataThumbnail';

interface IManifestData {
    id: string;
    type: string;
    label: string | null;
    logo: string | null;
    attribution: string;
    manifestations: any;
    parentId?: string;
    collections: any;
    manifests: any;
    resource: any;
    restricted: boolean;
    metadata: any;
    license: string;
    description: string;
    thumbnail?: IManifestDataThumbnail;
}

export default IManifestData;
