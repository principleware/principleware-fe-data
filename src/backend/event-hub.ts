/**
 * @fileOverview
 * A decorator to Backbone. It tracks all sync events of the Backbone
 * in a nonintrusive manner.
 */

import * as dependencies from '@polpware/fe-dependencies';

const backbone = dependencies.backbone;
const meld = dependencies.meld;

/**
 * The callback for the sync event.
 * @callback EventHubcallback
 * @param {Object} method The method assoicated with the sync event.
 * @param {Object} model The model assoicated with the sync event.
 * @param {Object} response The response assoicated with the sync event.
 * @param {Object} options The options associated with the sync event.
 */

/**
 * Sets up a callback for listening to the sync events from Backbone.
 * @function mountSyncListener
 * @param {EventHubcallback} callback
 * @throws {Error}
 */
export function mountSyncListener(callback) {
    // Collection
    const remover1 = meld.before(backbone.Collection.prototype, 'trigger', callback);
    const remover2 = meld.before(backbone.Model.prototype, 'trigger', callback);
    return [remover1, remover2];
}

/**
 * The callback for the sync event.
 * @callback EventHubsyncSignature
 * @param {String} method The method assoicated with the sync event.
 * @param {Object} model The model assoicated with the sync event.
 * @param {Object} options The options associated with the sync event.
 */

/**
 * Sets up a pre-sync callback.
 * @function mountSyncBeforeAdvice
 * @param {EventHubsyncSignature} callback
 */
export function mountSyncBeforeAdvice(callback) {
    return meld.before(backbone, 'sync', callback);
}

/**
 * The signature for the around advice.
 * @callback EventHubaroundAdviceSignature
 * @param {String} jointpoint the jointpoint for this advice.
 */

/**
 * Sets up an around advice.
 * @function mountSyncAroundAdvice
 * @param {EventHubaroundAdviceSignature} callback
 */
export function mountSyncAroundAdvice(callback) {
    return meld.around(backbone, 'sync', callback);
}


/**
 * Sets up a pre-ajax callback.
 * @function mountAjaxBeforeAdvice
 * @param {Function} callback
 */
export function mountAjaxBeforeAdvice(callback) {
    return meld.before(backbone, 'ajax', callback);
}

