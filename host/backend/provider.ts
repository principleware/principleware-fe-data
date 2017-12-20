/**
 * @fileOverview
 * Provides a layer of backend service abstraction.
 * Defines the backend services. This class is built onto the backbone js, but with
 * enhanced abilities of managing the dependency among all services of the backend,
 * and caching some type of objects for a period of time. 
 */
/*jslint unparam: true */

import * as dependencies from 'principleware-fe-dependencies';

import { urlEncode } from 'principleware-fe-utilities/src/tools/url';

import { SlidingExpirationCache } from '../cache/sliding-expiration-cache';

import { IJoinpoint } from '../interfaces/joint-point.interface';

import {
    mountSyncBeforeAdvice,
    mountAjaxBeforeAdvice,
    mountSyncAroundAdvice
} from './event-hub';

const DataFlow = dependencies['data-flow'];
const backbone = dependencies.backend;
const backbonePaginator = dependencies['backbone-paginator'];
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

const globalConfigurationMapping = {};
const mountedFeatureRemovers = [];

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
            const configuration = globalConfigurationMapping[options.endPointKey];
            const confOptions = configuration.options;
            if (method === 'delete') {
                if (confOptions.deleteUrl) {
                    options.url = confOptions.deleteUrl;
                }
                if (confOptions.deleteContentType) {
                    options.contentType = confOptions.deleteContentType;
                }
            } else if (method === 'update') {
                if (confOptions.updateUrl) {
                    options.url = confOptions.updateUrl;
                }
                if (confOptions.updateContentType) {
                    options.contentType = confOptions.updateContentType;
                }
            } else if (method === 'create') {
                if (confOptions.createUrl) {
                    options.url = confOptions.createUrl;
                }
                if (confOptions.createContentType) {
                    options.contentType = confOptions.createContentType;
                }
            } else if (method === 'patch') {
                if (confOptions.patchUrl) {
                    options.url = confOptions.patchUrl;
                }
                if (confOptions.patchContentType) {
                    options.contentType = confOptions.patchContentType;
                }
            }
        }
    });

    mountedFeatureRemovers.push(remover);
    remover = mountAjaxBeforeAdvice(function(options) {
        if (options.endPointKey) {
            const configuration = globalConfigurationMapping[options.endPointKey];
            const confOptions = configuration.options;
            const policyDelegate = confOptions.securityDelegate;
            const extraParams = confOptions.extraParams;
            if (configuration.contentType === 'application/x-www-form-urlencoded' &&
                options.contentType === 'application/json') {
                options.data = JSON.parse(options.data);
                if (extraParams) {
                    _.extend(options.data, extraParams);
                }
                if (policyDelegate) {
                    policyDelegate(options);
                }
                options.data = urlEncode(options.data);
                options.contentType = configuration.contentType;
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
            const configuration = globalConfigurationMapping[options.endPointKey];
            if (configuration.options && configuration.options.syncDelegate) {
                const syncDelegate = configuration.options.syncDelegate;
                // Return a promise
                return syncDelegate(options.endPointKey, options, configuration, function() {
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
    webhost?: string
}

export class GlobalProvider {

    private _host: string;
    private _dataflow: any;
    private _cache: SlidingExpirationCache<any>;
    private _myEndPointKeys: any[];
    private _uniqueNamePrefix: string;

    constructor(settings: IGlobalProviderCtorOptions) {
        this._cache = new SlidingExpirationCache(defaultLivePeroid);
        this._dataflow = new DataFlow();
        this._myEndPointKeys = [];
        this._host = (settings && settings.webhost) ? settings.webhost : '';
        this._uniqueNamePrefix = this._host ? this._host.replace('.', '-') + '-' : '';

        // Mount features
        mountFeatures();
    }

    public get host(): string {
        return this._host;
    }

    public get configurationMapping(): any {
        return globalConfigurationMapping;
    }

    /**
     * Defines an endpoint for a kind of service.
     */
    addEndPoint(name: string, tag: number, options: object) {
        const confMapping = this.configurationMapping;
        const dataflow = this._dataflow;
        const uniqueName = this._uniqueNamePrefix + name;

        if (confMapping[uniqueName]) {
            throw new Error('Redefined endpoint: ' + name);
        }
        confMapping[uniqueName] = {
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
            const value = cache.get(uniqueName);
            if (value) {
                return value;
            }
        }

        const confMapping = this.configurationMapping;

        const configuration = confMapping[uniqueName];
        if (!configuration) {
            const error = new Error('No given endpoint is defined for: ' + name);
            throw error;
        }

        let value = null;
        if (configuration.tag === endPointEnum.model) {
            value = backbone.Model.extend(configuration.options);
        } else if (configuration.tag === endPointEnum.collection) {
            value = backbone.Collection.extend(configuration.options);
        } else if (configuration.tag === endPointEnum.pagedCollection) {
            value = backbone.PageableCollection.extend(configuration.options);
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
        const confMapping = this.configurationMapping;
        return confMapping[uniqueName];
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
        this._myEndPointKeys.forEach(function(oneKey) {
            delete this.configurationMapping[oneKey];
        });

        this._myEndPointKeys = [];

        this._cache.destroy();

        // No destroy methods for the following two instances.
        this._cache = null;
        this._dataflow = null;
        this._host = null;
        this._uniqueNamePrefix = null;
    }
}



