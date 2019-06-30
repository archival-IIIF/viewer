class WindowInfo {

    static getHeight() {
        const w = window;
        const d = document;
        const e = d.documentElement;
        const g = d.getElementsByTagName('body')[0];

        return w.innerHeight || e.clientHeight || g.clientHeight;
    }
}

export default WindowInfo;
