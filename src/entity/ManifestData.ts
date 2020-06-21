import IManifestData, {IAuthService, IManifestReference} from '../interface/IManifestData';
import {LabelValuePair, LanguageMap} from "manifesto.js";

class ManifestData implements IManifestData {

    id: string;
    request?: string;
    type: string;
    label: LanguageMap;
    logo: string;
    attribution: LabelValuePair | null;
    manifestations: string;
    parentId: undefined;
    collections: IManifestReference[];
    manifests: IManifestReference[];
    resource: string;
    restricted: false;
    metadata: LabelValuePair[];
    license: null;
    description: LanguageMap;
    thumbnail: undefined;
    authService?: IAuthService;

    constructor() {
        this.id = '';
        this.request = '';
        this.type = '';
        this.label = new LanguageMap();
        this.logo = '';
        this.attribution = null;
        this.manifestations = '';
        this.collections = [];
        this.manifests = [];
        this.resource = '';
        this.restricted = false;
        this.metadata = [];
        this.description = new LanguageMap();
        this.authService = undefined;
    }
}

export default ManifestData;
