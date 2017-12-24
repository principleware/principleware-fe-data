/**
 * @fileOverview
 * Defines a class for performing XHR in an exception way and in a promise way
 */

import * as dependencies from 'principleware-fe-dependencies';

import * as XHR from 'principleware-tinymce-tailor/src/util/XHR';

import { urlEncode } from 'principleware-fe-utilities/src/tools/url';

const _ = dependencies.underscore;

export interface IXHRCtorOption {
    url: string;
    async?: boolean;
    type?: 'POST' | 'GET',
    content_type: 'application/x-www-form-urlencoded' | 'application/json' | '',
    response_type: 'json' | 'blob' | 'document' | 'text' | 'arraybuffer' | '',
    requestheaders: any[];
    scope?: any,
    success_scope?: any,
    error_scope?: any,
    data?: any;
}

const defaultOptions = {
    async: true,
    content_type: '',
    response_type: 'json',
    requestheaders: [],
    success_scope: null,
    error_scope: null,
    scope: null
};

export function sendPromise(options: IXHRCtorOption): PromiseLike<any> {
    const settings = _.extend({}, defaultOptions, options);

    let promise: PromiseLike<any> = new Promise((resolve, reject) => {
        const xhrSettings = {
            url: settings.url,
            content_type: settings.content_type,
            response_type: settings.response_type,
            type: settings.type,
            data: settings.data,
            async: settings.async,
            success: resolve,
            error: reject,
            success_scope: settings.success_scope,
            error_scope: settings.error_scope,
            scope: settings.scope,
            requestheaders: settings.requestheaders
        };
        // Process sent-out data
        if (settings.content_type === 'application/x-www-form-urlencoded') {
            xhrSettings.data = urlEncode(xhrSettings.data);
        } else if (settings.content_type === 'application/json') {
            xhrSettings.data = JSON.stringify(xhrSettings.data);
        }
        XHR.send(xhrSettings);
    });

    promise = promise.then(function(data) {
        if (settings.response_type === 'json') {
            data = JSON.parse(data);
        }
        return data;
    });

    return promise;
}
