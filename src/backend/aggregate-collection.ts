/**
 * @fileOverview
 * An endpoint which aggregates a few other endpoints, to form a new endpoint.
 * Note that the caller is responsible for resetting underlying data providers
 * and even caching them.
 * Moreover, this class does not assume any knowledge about providerGenerator.
 * providerGenerator may generate the same thing again as again.
 * Also note that it is the provider generator's responsibilty for
 * preversing the state of each data provider.
 */

import * as dependencies from '@polpware/fe-dependencies';

import { IBackboneCollectionLike } from '../interfaces/backbone.interface';

const when = dependencies.when;
const _ = dependencies.underscore;

function hasNextPage(collection: IBackboneCollectionLike): boolean {
    if (!collection.state.totalPages && !collection.state.totalRecords) {
        return true;
    }
    return collection.hasNextPage();
}

function getNextPage(collection: IBackboneCollectionLike): PromiseLike<any> {
    if (!collection.state.totalPages && !collection.state.totalRecords) {
        return collection.getFirstPage();
    }
    return collection.getNextPage();
}

export interface IProviderGenerator {
    hasMore(): boolean;
    getNext(): PromiseLike<Array<IBackboneCollectionLike>>;
    reset(): void;
}

export class AggregateCollection {

    private _workingProviders: Array<IBackboneCollectionLike>;

    constructor(private _providerGenerator: IProviderGenerator) {
        this._workingProviders = [];
    }

    hasNextPage(): boolean {
        // Case 1: The first time we request, we always have something.
        if (this._workingProviders.length === 0) {
            return true;
        }
        if (this._providerGenerator.hasMore()) {
            return true;
        }
        return _.some(this._workingProviders, function(elem) {
            return elem.hasNextPage();
        });
    }

    getFirstPage(): PromiseLike<any> {
        // Generate providers
        return this._providerGenerator.getNext()
            .then((providers) => {
                providers = _.filter(providers, function(p) {
                    return hasNextPage(p);
                });
                return providers;
            })
            .then((providers) => {
                this._workingProviders.length = 0;
                const promises = _.map(providers, function(p) {
                    return getNextPage(p)
                        .then((resp) => {
                            this._workingProviders.push(p);
                            return resp;
                        });
                });
                return when.settle(promises);
            });
    }

    getNextPage(): PromiseLike<any> {
        return this.getFirstPage();
    }

    reset(): void {
        this._providerGenerator.reset();
        this._workingProviders = [];
    }

    forEach(func: (elem: any) => any) {
        this._workingProviders.forEach((p) => {
            p.forEach(func);
        });
    }

    get(id) {
        // TODO:
    }
}

