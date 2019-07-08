import IManifestData from '../interface/IManifestData';

class ManifestData implements IManifestData {

    id: '';
    type: '';
    label: '';
    logo: '';
    attribution: '';
    manifestations: '';
    parentId: '';
    collections: '';
    manifests: '';
    resource: '';
    restricted: false;
    metadata: '';
    license: '';
    description: '';
    thumbnail: undefined;

    constructor() {
        this.id = '';
        this.type = '';
        this.label = '';
        this.logo = '';
        this.attribution = '';
        this.manifestations = '';
        this.parentId = '';
        this.collections = '';
        this.manifests = '';
        this.resource = '';
        this.restricted = false;
        this.metadata = '';
        this.license = '';
        this.description = '';
    }

}

export default ManifestData;
