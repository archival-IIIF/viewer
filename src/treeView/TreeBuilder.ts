import PresentationApi from "../fetch/PresentationApi";
import IManifestData from "../interface/IManifestData";

interface ITreeStatus {[key: string]: boolean};

class TreeBuilder {

    static cache: ITreeStatus = {};

    static buildCache(url: string, done: () => void) {

        PresentationApi.get(url).then(async function(manifestData: IManifestData) {
            TreeBuilder.cache[manifestData.id] = true;

            if (manifestData.parentId) {
                TreeBuilder.buildCache(manifestData.parentId, done);
            } else {
                if (done) {
                    done();
                }
            }

        });

    };


}

export default TreeBuilder;
