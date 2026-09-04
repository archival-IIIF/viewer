import type Config from "./Config";

declare let global: {
    config: Config;
};

export default function enterFullscreen() {

    const d = document;

    if (
        d.fullscreenElement
    ) {
        if (d.exitFullscreen) {
            d.exitFullscreen().then(_ => {});
        }
    }


    const element = document.getElementById(global.config.getID());
    if (!element) {
        return;
    }

    try {
        if (element.requestFullscreen) {
            element.requestFullscreen().then(_ => {});
        }
    } catch (_e) {
        return;
    }
}
