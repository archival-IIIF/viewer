import Config from "./Config";

declare let global: {
    config: Config;
};

export default function enterFullscreen() {

    const d: any = document as any;

    if (
        d.fullscreenElement ||
        d.webkitFullscreenElement ||
        d.mozFullScreenElement ||
        d.msFullscreenElement
    ) {
        if (d.exitFullscreen) {
            d.exitFullscreen();
        } else if (d.mozCancelFullScreen) {
            d.mozCancelFullScreen();
        } else if (d.webkitExitFullscreen) {
            d.webkitExitFullscreen();
        } else if (d.msExitFullscreen) {
            d.msExitFullscreen();
        }
    }


    const element: any = document.getElementById(global.config.getID());
    if (!element) {
        return;
    }

    try {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    } catch (e) {
        return;
    }
}
