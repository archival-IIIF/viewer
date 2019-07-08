import EventEmitter from 'events';
class Cache {

    static token: string = '';

    static ee = new EventEmitter();
}

export default Cache;
