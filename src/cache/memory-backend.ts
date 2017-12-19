import { ICacheBackend } from './cache-backend.interface';


export class MemoryBackend<T> implements ICacheBackend<T> {

    private _store: { [key: string]: T };

    constructor() {
        this._store = {};
    }

    /**
     * Sets a key-value pair
     */
    set(key: string, value: T): T {
        this._store.key = value;
        return value;
    }

    /**
     * Gets the value for a given key.
     */
    get(key: string): T | null {
        return this._store.key || null;
    }

    /**
     * Removes the given key and its corresponding value.
     */
    remove(key: string): void {
        delete this._store.key;
    }

    /**
     * Returns the number of stored items.
     */
    length(key: string): number {
        return Object.keys(this._store).length;
    }

    /**
     * Retuns the ith key in the store table.
     * @function key
     * @param {Number} i the index of the key to be searched for.
     * @returns {String} The key at the index.
     */
    key(index: number): T | null {
        const keys = Object.keys(this._store);

        if (index >= 0 && index < keys.length) {
            return this._store[keys[index]];
        }

        return null;
    }

    /**
     * Returns if this storage is enabled.
     * This method is required by locachejs.
     */
    enabled(): boolean {
        return true;
    }
}

