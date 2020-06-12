class ManifestHistory {

    static previousIds: string[] = [];

    static pageChanged(id: string, label: string) {

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
        this.previousIds.splice(-1, 1);

        return this.previousIds.slice(-1)[0];
    }


}

export default ManifestHistory;
