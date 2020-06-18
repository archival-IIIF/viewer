import Manifest from "../../lib/Manifest";
import IManifestData from "../../interface/IManifestData";
import ITree from "../../interface/ITree";

class TreeBuilder {


    static get(url: string, tree?: ITree, done?: (finishedTree?: ITree) => void, limited?: boolean) {

        Manifest.get(
            url,
            async function(manifestData: IManifestData) {

                const tree2: ITree = {
                    id: manifestData.id,
                    label: manifestData.label,
                    isOpen: true,
                    children: []
                };
                for (const child of manifestData.collections) {
                    const newChild: ITree = {
                        id: child.id,
                        label: child.label,
                        children: []
                    }
                    if (tree && tree.id === child.id) {
                        newChild.children = tree.children;
                        newChild.isOpen = true;
                    } else {
                        const d: IManifestData = await new Promise((resolve, reject) => {
                            Manifest.get(child.id, function (d: IManifestData) {
                                resolve(d);
                            }, true);
                        });
                        newChild.hasLockedChildren = d.collections.length > 0;
                    }
                    tree2.children.push(newChild);
                }

                if(manifestData.parentId && limited !== true) {
                    TreeBuilder.get(manifestData.parentId, tree2, done);
                } else {
                    if (done) {
                        done(tree2);
                    }
                }

            }
        );

    };


}

export default TreeBuilder;
