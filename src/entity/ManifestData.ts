import IManifestData, {
    IAuthService,
    IManifestReference,
    IPresentationApiImage,
    IPresentationApiItemsType
} from '../interface/IManifestData';
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
    itemsType: IPresentationApiItemsType = 'file';
    restricted: false;
    metadata: LabelValuePair[];
    license: null;
    description: PropertyValue;
    thumbnail: undefined;
    authService?: IAuthService;
    transcription: ITranscription[];
    images: IPresentationApiImage[];

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
        this.restricted = false;
        this.metadata = [];
        this.description = new PropertyValue();
        this.authService = undefined;
        this.transcription = [];
        this.images = [];
        this.license = null;
    }
}

export default ManifestData;
