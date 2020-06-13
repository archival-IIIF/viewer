import IManifestData from '../interface/IManifestData';

class ManifestData implements IManifestData {

    id: '';
    key: '';
    type: '';
    label: '';
    logo: '';
    attribution: '';
    manifestations: '';
    parentId: undefined;
    collections: '';
    manifests: '';
    resource: '';
    restricted: false;
    metadata: '';
    license: undefined;
    description: '';
    thumbnail: undefined;

    constructor() {
        this.id = '';
        this.key = '';
        this.type = '';
        this.label = '';
        this.logo = '';
        this.attribution = '';
        this.manifestations = '';
        this.collections = '';
        this.manifests = '';
        this.resource = '';
        this.restricted = false;
        this.metadata = '';
        this.description = '';
    }

}

export default ManifestData;
