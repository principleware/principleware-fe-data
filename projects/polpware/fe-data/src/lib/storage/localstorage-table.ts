/**
 * @fileOverview
 * Encapsulates the local storage service into one
 * providing prmoise-aware services.
 * @name LocalStorageTable.js
 * @module hypercom/storage/LocalStorageTable
 * @author Xiaolong Tang <xxlongtang@gmail.com>
 * @license Copyright @me
 */

import * as polpwareUtil from '@polpware/fe-utilities';

import * as localStorageUtil from './localstorage-util';

/**
 * @class LocalStorageTable
 */
export class LocalStorageTable {

    /**
     * Gets the value for the given key.
     * @function getP
     * @param {String} key The key to be searched for.
     * @returns {Promise}
     * @throws {Error}
     */
    getP(key: string): PromiseLike<object> {
        const data = localStorageUtil.getEntity(key, polpwareUtil.tyObject);
        return polpwareUtil.lift(data, null);
    }

    /**
     * Removes the key from the keychain.
     * @function removeP
     * @param {String} key The key to be removed.
     * @returns {Promise}
     * @throws {Error}
     */
    removeP(key: string): PromiseLike<boolean> {
        localStorageUtil.cleanEntity(key, polpwareUtil.tyObject);
        return polpwareUtil.lift(true, null);
    }

    /**
     * Updates the value for the given key.
     * @param {String} key The key to be searched for.
     * @param {Object} value The new value.
     * @returns {Promise}
     * @throws {Error}
     */
    updateP(key: string, value: object): PromiseLike<boolean> {
        localStorageUtil.updateEntity(key, value, polpwareUtil.tyObject);
        return polpwareUtil.lift(true, null);
    }

}
