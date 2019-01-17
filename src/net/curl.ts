/**
 * @fileOverview
 * Provides a bunch of utilties on network communication.
 * @name Curl.js
 * @module hypercom/util/Curl
 * @author Xiaolong Tang <xxlongtang@gmail.com>
 * @license Copyright @me
 */
import * as dependencies from '@polpware/fe-dependencies';
import * as tools from 'polpware-tinymce-tailor/src/util/Tools';

const $ = dependencies.jquery;

/**
 * Load a local json file from the given url.
 * This method encapsulates the behavior of loading a local json
 * file, in order that changing its behavior in the future
 * will not impact other modules.
 * We currently leaverage the cache capability of a browser.
 * In the future, we may use memory cache.
 * Also this method returns a promise compatible project, and
 * therefore, please use "then" to go future.
 * @function loadJsonUriP
 * @param {String} url
 * @returns {Promise}
 */
export function loadJsonUriP(url) {
    const deferred = $.ajax({
        url: url, /* 'lang/options.json', */
        cache: true,
        dataType: 'json'
    });
    return deferred;
}

/**
 * Tests if a url is reachable.
 * @function pingP
 * @param {String} url The url to be tested.
 * @param {Object} [options]  A set of ajax parameters.
 * @returns {Promise}
 */
export function pingP(url, options) {
    options = options || {};
    const ajaxParams = tools.extend({ url: url }, options);
    return $.ajax(ajaxParams);
}

/**
 * Reads a the response from a given url and
 * parses it into a jquery object.
 * @function loadHtmlP
 * @param {String} url
 * @returns {Promise}
 */
export function loadHtmlP(url) {
    return $.ajax({
        url: url,
        dataType: 'html text'
    }).then(function(data) {
        /*global DOMParser */
        const doc = new DOMParser().parseFromString(data, 'text/html');
        return $(doc);
    });
}
