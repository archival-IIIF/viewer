import PresentationApi from "../fetch/PresentationApi";
import IManifestData from "../interface/IManifestData";
import Config from "../lib/Config";

interface ITreeStatus {[key: string]: boolean};

declare let global: {
    config: Config;
};

class TreeBuilder {

    static cache: ITreeStatus = {};

    static buildCache(url: string, done: () => void) {

        PresentationApi.get(url).then(async function(manifestData: IManifestData) {
            TreeBuilder.cache[manifestData.id] = true;

            if (manifestData.parentId) {
                TreeBuilder.buildCache(manifestData.parentId, done);
                if (!global.config.getLazyTree()) {
                    for (const child of manifestData.collections) {
                        await PresentationApi.get(child.id, true);
                    }
                }
            } else {
                if (!global.config.getLazyTree()) {
                    for (const child of manifestData.collections) {
                        await PresentationApi.get(child.id, true);
                    }
                }
                if (done) {
                    done();
                }
            }

        });

    };


}

export default TreeBuilder;
