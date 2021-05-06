import IManifestData, {IAuthService, IManifestReference} from '../interface/IManifestData';
import {LabelValuePair, PropertyValue} from "manifesto.js";
import ITranscription from "../interface/ITranscription";

class ManifestData implements IManifestData {

    id: string;
    request?: string;
    type: string;
    label: PropertyValue;
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
    description: PropertyValue;
    thumbnail: undefined;
    authService?: IAuthService;
    transcription: ITranscription[];

    constructor() {
        this.id = '';
        this.request = '';
        this.type = '';
        this.label = new PropertyValue();
        this.logo = '';
        this.attribution = null;
        this.manifestations = '';
        this.collections = [];
        this.manifests = [];
        this.resource = '';
        this.restricted = false;
        this.metadata = [];
        this.description = new PropertyValue();
        this.authService = undefined;
        this.transcription = [];
    }
}

export default ManifestData;
