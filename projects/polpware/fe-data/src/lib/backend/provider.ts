/**
 * @fileOverview
 * Provides a layer of backend service abstraction.
 * Defines the backend services. This class is built onto the backbone js, but with
 * enhanced abilities of managing the dependency among all services of the backend,
 * and caching some type of objects for a period of time.
 */
/*jslint unparam: true */

import * as dependencies from '@polpware/fe-dependencies';

import { urlEncode } from '@polpware/fe-utilities';

import { SlidingExpirationCache } from '../cache/sliding-expiration-cache';

import { IJoinpoint } from '../interfaces/joint-point.interface';

import {
    mountSyncBeforeAdvice,
    mountAjaxBeforeAdvice,
    mountSyncAroundAdvice
} from './event-hub';

import { IBackboneOptions, IBackboneConfiguration } from './interfaces';

const DataFlow = dependencies['data-flow'];
const backbone = dependencies['backbone'];
const _ = dependencies.underscore;

/**
 * The endpoint types for a backend service.
 */
export const endPointEnum = {
    model: 1,
    collection: 2,
    pagedCollection: 3
};

/**
 * The sync types defined in the backbone js.
 */
export const syncMethodEnum = {
    /**
     * Fetch a model or a collection.
     */
    read: 'read',
    /**
     * Save a model.
     */
    create: 'create',
    patch: 'patch',
    update: 'update',
    /**
     * Destroy a model
     */
    delete: 'delete'
};

const globalConfigurationMapping: { [key: string]: IBackboneConfiguration } = {};
const mountedFeatureRemovers: any[] = [];

// Idempotent
// Instance once ...
function mountFeatures() {

    if (mountedFeatureRemovers.length > 0) {
        return;
    }
    /*jslint unparam: true */
    /*
      eventHub.mountSyncListener(function (method, model, response, options) {
      // Ignore other method
      if (method !== 'sync') {
      return;
      }
      if (options.endPointKey && options.methodKey) {
      var dataflow = self._dataflow,
      key = options.endPointKey + ':' + options.methodKey;
      dataflow[key] = dataflow[key] + 1;
      }
      }); */

    let remover = mountSyncBeforeAdvice(function(method, model, options) {
        options.methodKey = method;
        options.endPointKey = model.endPointKey || (model.collection ? model.collection.endPointKey : null);
        if (options.endPointKey) {
            const cfg = globalConfigurationMapping[options.endPointKey];
            const cfgOptions = cfg.options;
            if (method === 'delete') {
                if (cfgOptions.deleteUrl) {
                    options.url = cfgOptions.deleteUrl;
                }
                if (cfgOptions.deleteContentType) {
                    options.contentType = cfgOptions.deleteContentType;
                }
            } else if (method === 'update') {
                if (cfgOptions.updateUrl) {
                    options.url = cfgOptions.updateUrl;
                }
                if (cfgOptions.updateContentType) {
                    options.contentType = cfgOptions.updateContentType;
                }
            } else if (method === 'create') {
                if (cfgOptions.createUrl) {
                    options.url = cfgOptions.createUrl;
                }
                if (cfgOptions.createContentType) {
                    options.contentType = cfgOptions.createContentType;
                }
            } else if (method === 'patch') {
                if (cfgOptions.patchUrl) {
                    options.url = cfgOptions.patchUrl;
                }
                if (cfgOptions.patchContentType) {
                    options.contentType = cfgOptions.patchContentType;
                }
            }
        }
    });

    mountedFeatureRemovers.push(remover);
    remover = mountAjaxBeforeAdvice(function(options) {
        if (options.endPointKey) {
            const cfg = globalConfigurationMapping[options.endPointKey];
            const cfgOptions = cfg.options;
            const policyDelegate = cfgOptions.securityDelegate;
            const extraParams = cfgOptions.extraParams;
            if (cfgOptions.contentType === 'application/x-www-form-urlencoded' &&
                options.contentType === 'application/json') {
                options.data = JSON.parse(options.data);
                if (extraParams) {
                    _.extend(options.data, extraParams);
                }
                if (policyDelegate) {
                    policyDelegate(options);
                }
                options.data = urlEncode(options.data);
                options.contentType = cfgOptions.contentType;
            } else {
                if (extraParams) {
                    _.extend(options.data, extraParams);
                }
                if (policyDelegate) {
                    policyDelegate(options);
                }
                if (options.contentType === 'application/x-www-form-urlencoded') {
                    options.data = urlEncode(options.data);
                }
            }
        }
    });
    mountedFeatureRemovers.push(remover);

    remover = mountSyncAroundAdvice(function(jointpoint: IJoinpoint) {
        const options = jointpoint.args[2];
        if (options.endPointKey) {
            const cfg = globalConfigurationMapping[options.endPointKey];
            const cfgOptions = cfg.options;
            if (cfgOptions.syncDelegate) {
                const syncDelegate = cfgOptions.syncDelegate;
                // Return a promise
                return syncDelegate(options.endPointKey, options, cfg, function() {
                    return jointpoint.proceed();
                });
            }
        }
        return jointpoint.proceed();
    });
    mountedFeatureRemovers.push(remover);
}

const defaultLivePeroid = 60 * 5;

export interface IGlobalProviderCtorOptions {
    webhost?: string;
}

export class GlobalProvider {

    private _host: string;
    private _dataflow: any;
    private _cache: SlidingExpirationCache<any>;
    private _myEndPointKeys: any[];
    private _uniqueNamePrefix: string;

    constructor(ctorOptions: IGlobalProviderCtorOptions) {
        this._cache = new SlidingExpirationCache(defaultLivePeroid);
        this._dataflow = new DataFlow();
        this._myEndPointKeys = [];
        this._host = ctorOptions.webhost || '';
        this._uniqueNamePrefix = this._host ? (this._host.replace('.', '-') + '-') : '';

        // Mount features
        mountFeatures();
    }

    public get host(): string {
        return this._host;
    }

    public get configurationMapping(): { [key: string]: any } {
        return globalConfigurationMapping;
    }

    /**
     * Defines an endpoint for a kind of service.
     */
    addEndPoint(name: string, tag: number, options: IBackboneOptions) {
        const cfgMapping = this.configurationMapping;
        const dataflow = this._dataflow;
        const uniqueName = this._uniqueNamePrefix + name;

        if (cfgMapping[uniqueName]) {
            throw new Error('Redefined endpoint: ' + name);
        }
        cfgMapping[uniqueName] = {
            options: _.extend(options, { endPointKey: uniqueName }),
            tag: tag
        };

        this._myEndPointKeys.push(uniqueName);

        // Set up data flow nodes (it is enough to use local names)
        if (tag === endPointEnum.model) {
            for (const k in syncMethodEnum) {
                // skip loop if the property is from prototype
                if (syncMethodEnum.hasOwnProperty(k)) {
                    const value = syncMethodEnum[k];
                    dataflow[name + ':' + value] = 1;
                }
            }
        } else {
            dataflow[name + ':' + syncMethodEnum.read] = 1;
        }
    }

    /**
     * Retrieves the endpoint by the given name.
     */
    getEndPoint(name: string, ignoreCache?: boolean) {
        const cache = this._cache;
        const uniqueName = this._uniqueNamePrefix + name;

        if (ignoreCache !== true) {
            const cachedValue = cache.get(uniqueName);
            if (cachedValue) {
                return cachedValue;
            }
        }

        const cfgMapping = this.configurationMapping;

        const cfg = cfgMapping[uniqueName];
        if (!cfg) {
            const error = new Error('No given endpoint is defined for: ' + name);
            throw error;
        }

        let value = null;
        if (cfg.tag === endPointEnum.model) {
            value = backbone.Model.extend(cfg.options);
        } else if (cfg.tag === endPointEnum.collection) {
            value = backbone.Collection.extend(cfg.options);
        } else if (cfg.tag === endPointEnum.pagedCollection) {
            value = backbone.PageableCollection.extend(cfg.options);
        } else {
            throw new Error('Not implemented');
        }

        if (ignoreCache !== true) {
            cache.set(uniqueName, value, defaultLivePeroid);
        }
        return value;
    }

    /**
     * Get the underlying configuration for an endpoint.
     */
    getConfiguration(endPointKey: string) {
        const uniqueName = this._uniqueNamePrefix + endPointKey;
        const cfgMapping = this.configurationMapping;
        return cfgMapping[uniqueName];
    }

    /**
     * Provides the callback when some operations happen.
     */
    addWhenCallback(name: string[], callback: any) {
        const dataflow = this._dataflow;
        dataflow.when(name, callback);
    }

    /**
     * Defines the dependency.
     */
    addDependency(src: string, dst: string) {
        const dataflow = this._dataflow;
        dataflow.on(src, function() {
            dataflow[dst] = dataflow[dst] + 1;
        });
    }

    /**
     * Clean up all cached data provider
     */
    cleanupCache() {
        // Remove what we have in cache
        this._cache.reset();
    }

    cleanMountedFeatures() {
        mountedFeatureRemovers.forEach(function(remover) {
            remover.remove();
        });
        mountedFeatureRemovers.length = 0;
    }

    /**
     * Destroy the provider to release resources
     */
    destroy() {
        // Delete cache
        this._myEndPointKeys.forEach(function(k) {
            delete globalConfigurationMapping[k];
        });

        this._myEndPointKeys.length = 0;

        this._cache.destroy();

        // No destroy methods for the following two instances.
        this._cache = null;
        this._dataflow = null;
        this._host = null;
        this._uniqueNamePrefix = null;
    }
}



