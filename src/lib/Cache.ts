import * as  EventEmitter from 'events';
import TouchDetection from './TouchDetection';
class Cache {

    static token: string = '';

    static ee = new EventEmitter();

    static intialWidth = 300;

    static viewerHeight = 18;

    static getSplitterWidth(folded: boolean) {

        if (TouchDetection.isTouchDevice()) {
            if (folded === true) {
                return 32;
            }

            return 16;
        }

        return 8;
    }
}

export default Cache;
