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
    thumbnail: null;

}

export default ManifestData;
