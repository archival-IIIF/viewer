import PresentationApi from "../fetch/PresentationApi";

class ManifestHistory {

    static previousIds: string[] = [];

    static pageChanged(id: string, label: string, q?: string, tab?: string) {

        let previousId = '';
        if (this.previousIds.length > 0) {
            previousId = this.previousIds.slice(-1)[0];
        }
        if (previousId !== id) {
            this.previousIds.push(id);
        }

        let url = '?manifest=' + id;

        q = q ?? PresentationApi.getGetParameter('q');
        if (q) {
            url += '&q=' + q;
        }

        tab = tab ?? PresentationApi.getGetParameter('tab');
        if (tab) {
            url += '&tab=' + tab;
        }

        window.history.pushState({}, label, url);

    }

    static goBack() {
        // delete current
        this.previousIds.splice(-1, 1);

        return this.previousIds.slice(-1)[0];
    }


}

export default ManifestHistory;
