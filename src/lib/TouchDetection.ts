class TouchDetection {

    static isTouchDevice() {
        return 'ontouchstart' in window        // works on most browsers
            || 'onmsgesturechange' in window;  // works on IE10 with some false positives
    }
}

export default TouchDetection;
