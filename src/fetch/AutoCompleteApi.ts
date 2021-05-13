export interface IAutoCompleteTerms {
    match: string;
    url: string;
    counter: number
}

export default function fetchAutoCompleteApi(url: string): Promise<IAutoCompleteTerms[]> {
    return new Promise((resolve, reject) => {
        fetch(url).then(response => {

            if (response.status !== 401 && response.status >= 400) {
                reject({
                    title: 'Error',
                    body: 'Could not fetch info.json!\n\n' + url
                });
                return;
            }

            response.json().then(data => {
                resolve(data.terms ?? []);
            });
        })
    });
}
