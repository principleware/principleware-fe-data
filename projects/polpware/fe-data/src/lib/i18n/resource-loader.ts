/**
 * @fileOverview
 * Defines a Resources class.
 * With this class, you may configure a bunch of resources
 * accessible from global URIs, such as URLs.
 * Once the requested resources are loaded, they may be
 * cached in the memory.
 * Note that the resources are expected to be organized in
 * a common namespace hierarchy.
 * E.g.,
 * x.y.z corresponds to a json resource like:
 *    {
 *       y: {
 *             z: 112
 *          }
 *    }
 * @author Xiaolong Tang <xxlongtang@gmail.com>
 * @license Copyright @me
 */


import * as externalInterface from '@polpware/fe-dependencies';
import { replace, lift, convert } from '@polpware/fe-utilities';

import { ISlidingExpireCache } from '../cache/sliding-expire-cache.interface';

import { loadJsonUriP } from '../net/curl';


const _ = externalInterface.underscore;
const isString = _.isString;


/**
 * Retrieves a value from a variable by a given namespace nested structure.
 * @function getByNamespace
 * @param {Object} repo
 * @param {*} fullyQualifiedNamespace A string or an arry of string defining the namespace.
 * @param {Number}[] startLevel
 * @returns {*}
 */
function getByNamespace<T>(repo: { [key: string]: T },
    identifiers: Array<string>,
    startLevel: number = 1): T {

    const restIdentifiers = identifiers.slice(startLevel);
    const restKey = restIdentifiers.join('.');
    if (repo[restKey]) {
        return repo[restKey];
    }

    let initRepo: any = repo;
    for (let index = startLevel; index < identifiers.length; index++) {
        if (!initRepo) {
            break;
        }
        const key = identifiers[index];
        initRepo = initRepo[key];
    }
    return initRepo;
}

interface IConfigurationEntry {
    uri: string;
    liveSeconds: number;
}

/**
 * @class Resources
 */
export class ResourceLoader {

    private _configuration: { [key: string]: IConfigurationEntry };

    /**
     * Constructor
     * @function init
     */
    constructor(private _cache: ISlidingExpireCache<any> = null) {
        this._configuration = {};
    }

    /**
     * Configure a resource
     * @function register
     * @param {String} key The resource key.
     * @param {String} uri The resource URI.
     * @param {Number} liveSeconds The cache period.
     * @throws {Error}
     */
    register(key: string, uri: string, liveSeconds: number = 60) {
        const configuration = this._configuration;
        if (configuration[key]) {
            throw new Error('Registering an existing resource key: ' + key);
        }
        configuration[key] = {
            uri: uri,
            liveSeconds: liveSeconds
        };
    }

    /**
     * Removes a registered item
     * @function undoRegister
     * @param {String} key The resource key to be removed.
     */
    undoRegister(key: string) {
        const configuration = this._configuration;
        if (configuration[key]) {
            delete configuration[key];
        }
    }
    /**
     * Returns a promise for the resource key.
     * @function getPromise
     * @param {String} fullyQualifiedNamespace The resource key.
     * @returns {*} The resource value.
     * @throws {Error}
     */
    getPromise<T>(fullyQualifiedNamespace: string,
        convertor: (any) => any): PromiseLike<T> {
        const identifiers = fullyQualifiedNamespace.split('.');
        const topIdentifier = identifiers[0];
        const cache = this._cache;
        if (cache) {
            // Figure out the master key
            const repo = cache.get(topIdentifier, 60);
            if (repo) {
                const value = getByNamespace<T>(repo, identifiers);
                if (value) {
                    // Return a promise
                    return lift(value, null);
                }
            }
        }

        const entry = this._configuration[topIdentifier];
        if (!entry) {
            throw new Error('Get unregistered resource: ' + topIdentifier);
        }

        // Otherwise, load it
        return loadJsonUriP(entry.uri).then((content) => {
            content = convertor(content);
            // Cache the new value
            if (cache) {
                cache.set(topIdentifier, content, entry.liveSeconds);
            }
            return getByNamespace(content, identifiers);
        });
    }
}
