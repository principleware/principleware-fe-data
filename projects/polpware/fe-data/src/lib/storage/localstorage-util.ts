/**
 * @fileOverview
 * Provides type-safety operations of manipulating LocalStorage data.
 * @name LocalStorageUtil.js
 * @module hypercom/storage/LocalStorageUtil
 * @author Xiaolong Tang <xxlongtang@gmail.com>
 * @license Copyright @me
 */
import * as externalInterface from '@polpware/fe-dependencies';
// as polyfill for localstorage
// Do NOT use the LocalStorage as there is global variable which cannot be resolved
// and which is defined only in TINYMCE.
// import * as localStorage from 'polpware-tinymce-tailor/src/util/LocalStorage.js';

const globalLocalStorage = window.localStorage;

import {
    defaultValue,
    ITypeDef,
    tyArray,
    ok as isType
} from '@polpware/fe-utilities';

const _ = externalInterface.underscore,
    find = _.find,
    findIndex = _.findIndex,
    union = _.union;

export interface IEntity {
    Id: any;
}

/**
 * Reads the value of an entity by its key.
 * @function getEntity
 * @param {String} key The entity key.
 * @param {*} ty The type of the entity value.
 * @returns {*} The entity value.
 */

export function getEntity(key: string, ty: ITypeDef): any {
    let data = defaultValue(ty);
    try {
        let tmp = globalLocalStorage.getItem(key);
        if (tmp && tmp !== 'undefined') {
            tmp = JSON.parse(tmp);
            if (isType(tmp, ty)) {
                data = tmp;
            }
        }
    } catch (ex) {
        console.log(ex);
    }
    return data;
}
/**
 * Updates the value of an entity by its key.
 * @function updateEntity
 * @param {String} key The entity key.
 * @param {*} data The new value to be replaced with.
 * @param {*} ty The type of the entity value.
 */
export function updateEntity(key: string, data: any, ty: ITypeDef = null) {
    try {
        globalLocalStorage.setItem(key, JSON.stringify(data));
    } catch (ex) {
        console.log(ex);
    }
}
/**
 * Cleans the value of an entity by its key.
 * @function cleanEntity
 * @param {String} key The entity key.
 * @param {*} ty The type of the entity value.
 */
export function cleanEntity(key: string, ty: ITypeDef) {
    try {
        globalLocalStorage.setItem(key, JSON.stringify(defaultValue(ty)));
    } catch (ex) {
        console.log(ex);
    }
}
/**
 * Inserts the given data into the value of an entity of type array.
 * Note that the inserted data should be disjoint with the current data
 * stored in this entity. Otherwise, the behavior may be undefined.
 * @function insertEntities
 * @param {String} key The entity key.
 * @param {Array} data The value to be inserted.
 * @param {Number} upperBound The max number of elements allows for this entity value.
 */
export function insertEntities(key: string, data: Array<IEntity>, upperBound: number) {
    let newData = [];
    const currentData = getEntity(key, tyArray) as Array<IEntity>;
    if (upperBound > 0 && currentData.length > upperBound) {
        newData = data;
    } else {
        newData = union(currentData, data);
    }
    updateEntity(key, newData, tyArray);
}
/**
 * Finds one element of an entity of type array.
 * @function findEntityById
 * @param {String} key The entity key.
 * @param {Number} id The identifier value. An Id field is assumed for each element.
 * @returns {*} The value of the found element.
 */
export function findEntityById(key: string, id): IEntity {
    const data = getEntity(key, tyArray) as Array<IEntity>;
    return find(data, { Id: id });
}

/**
 * Removes an element of an entity of type array.
 * @function removeEntityById
 * @param {String} key The entity key.
 * @param {Number} id The identifier value for the element to be removed.
 */
export function removeEntityById(key: string, id) {
    const data = getEntity(key, tyArray) as Array<IEntity>;
    const index = findIndex(data, { Id: id });
    if (index === -1) {
        return;
    }
    data.splice(index, 1);
    updateEntity(key, data, tyArray);
}
/**
 * Inserts or udpates an element of an entity of type array.
 * @function insertOrUpdateEntity
 * @param {String} key The entity key.
 * @param {Array} entity The new value of the entity.
 */
export function insertOrUpdateEntity(key: string, entity: IEntity) {
    const data = getEntity(key, tyArray) as Array<IEntity>;
    const index = findIndex(data, { Id: entity.Id });
    if (index !== -1) {
        data[index] = entity;
    } else {
        data.push(entity);
    }
    updateEntity(key, data, tyArray);
}
/**
 * Removes a group of entities by a given prefix.
 * @function cleanEntityGroup
 * @param {String} prefix The prefix of the keys of the entities to be removed. We organize entities somewhat hirarchly.
 * @returns {Boolean}
 */
export function cleanEntityGroup(prefix: string): Array<string> {
    const keys = [];
    for (const p in globalLocalStorage) {
        if (globalLocalStorage.hasOwnProperty(p) &&
            p.indexOf(prefix) === 0) {
            keys.push(p);
        }
    }
    if (keys.length === 0) {
        return keys;
    }
    keys.forEach(function(k) {
        globalLocalStorage.removeItem(k);
    });
    return keys;
}
