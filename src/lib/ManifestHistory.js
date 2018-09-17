class ManifestHistory {

    static previousIds = [];

    static pageChanged(id, label) {

        let previousId = '';
        if (this.previousIds.length > 0) {
            previousId = this.previousIds.slice(-1)[0];
        }
        if (previousId !== id) {
            this.previousIds.push(id);
        }

        window.history.pushState({}, label, '?manifest=' + id);

    }

    static goBack() {
        // delete current
        this.previousIds.splice(-1,1);


        let backId = this.previousIds.slice(-1)[0];

        if (backId !== undefined) {
            global.ee.emitEvent('open-folder', [backId]);
        }
    }


}

export default ManifestHistory;

