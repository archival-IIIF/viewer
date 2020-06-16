import IManifestData, {IAuthService} from '../interface/IManifestData';

class ManifestData implements IManifestData {

    id: string;
    request?: string;
    type: string;
    label: string;
    logo: string;
    attribution: string;
    manifestations: string;
    parentId: undefined;
    collections: string;
    manifests: string;
    resource: string;
    restricted: false;
    metadata: string;
    license: undefined;
    description: string;
    thumbnail: undefined;
    authService?: IAuthService;

    constructor() {
        this.id = '';
        this.request = '';
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
        this.authService = undefined;
    }

}

export default ManifestData;
