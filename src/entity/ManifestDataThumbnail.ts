import IManifestDataThumbnail from '../interface/IManifestDataThumbnail';

class ManifestDataThumbnail implements IManifestDataThumbnail {

    id: string;
    service?: string;

    constructor() {
        this.id = '';
    }
}

export default ManifestDataThumbnail;
