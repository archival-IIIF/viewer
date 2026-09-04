class TouchDetection {

    static isTouchDevice() {
        return 'ontouchstart' in window;
    }
}

export default TouchDetection;
