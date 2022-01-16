class TouchDetection {

    static isTouchDevice() {
        return 'ontouchstart' in window || (navigator as any).msMaxTouchPoints > 0;
    }
}

export default TouchDetection;
