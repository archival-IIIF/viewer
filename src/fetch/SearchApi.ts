import IManifestData from "../interface/IManifestData";

export type HitType = {
    match: string;
    before: string;
    after: string;
    i: number;
    resource: AnnotationType;
}

export type AnnotationType = {
    id: string;
    on: string;
    x: number;
    y: number;
    page: number,
    width: number;
    height: number;
}

export default function  fetchSearchApi(searchUrl: string, manifest: IManifestData):  Promise<HitType[]> {
    return new Promise((resolve, reject) => {
        fetch(searchUrl).then((response) => {

            const statusCode = response.status;
            if (statusCode !== 401 && statusCode >= 400) {
                reject( {
                    title: 'Error',
                    body: 'Could not fetch search url!\n\n'  + searchUrl
                })
                return;
            }

            response.json().then((json) => {

                const hits: HitType[] = [];
                let resources = json.resources;
                let i = 0;
                for (const hit of json.hits) {
                    for (const annotation of hit.annotations) {

                        const resource = resources.find((r: any) => r['@id'] === annotation);
                        if (!resource) {
                            continue;
                        }
                        let tmpArray = resource.on.split('#xywh=');
                        if (tmpArray.length !== 2) {
                            console.log('Error: url must include #xywh=! ' + resource.on)
                            continue;
                        }
                        let position = tmpArray[1].split(',');

                        const page = manifest.images.findIndex(r => r.on === tmpArray[0]);
                        hits.push({
                            match: resources[i].resource.chars,
                            before: hit.before,
                            after: hit.after,
                            i: i++,
                            resource: {
                                id: resource['@id'],
                                on: tmpArray[0],
                                page,
                                x: parseInt(position[0]),
                                y: parseInt(position[1]),
                                width: parseInt(position[2]),
                                height: parseInt(position[3]),
                            }
                        });
                    }
                }

                resolve(hits);
            });
        }).catch((err) => {
            console.log(err);
            reject( {
                title: 'Error',
                body: 'Could not read search url!\n\n'  + searchUrl
            })
        });
    });
}
