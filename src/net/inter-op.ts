/**
 * @fileOverview
 * Provides utilities for making interoperable the promise-like objects
 * from different modules.
 */
/**
 * Extends a given promise into a deferred object of jQuery.
 * With this extension, we are able to chain together jQuery deferred
 * objects (which are also promise objects.)
 */
export function tojQueryDeferred(promise) {
    if (!promise.always) {
        promise.always = function(onFulfilled) {
            return this.then(onFulfilled, onFulfilled);
        };
    }
    if (!promise.done) {
        promise.done = function(onFulfilled) {
            return this.then(onFulfilled);
        };
    }
    if (!promise.fail) {
        promise.fail = function(onRejected) {
            return this.then(null, onRejected);
        };
    }
    if (!promise.progress) {
        promise.progress = function() {
            return this;
        };
    }
    if (!promise.promise) {
        promise.promise = function() {
            return this;
        };
    }
    return promise;
}
