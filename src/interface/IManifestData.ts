import IManifestDataThumbnail from './IManifestDataThumbnail';

interface IManifestData {
    id: string;
    type: string;
    label: string;
    logo: string;
    attribution: string;
    manifestations: any;
    parentId: string;
    collections: any;
    manifests: any;
    resource: any;
    restricted: boolean;
    metadata: any;
    license: string;
    thumbnail?: IManifestDataThumbnail;
}

export default IManifestData;
