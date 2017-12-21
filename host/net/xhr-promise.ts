/**
 * @fileOverview
 * Defines a class for performing XHR in an exception way and in a promise way
 */

import * as dependencies from 'principleware-fe-dependencies';

import * as XHR from 'principleware-tinymce-tailor/util/XHR';

import { urlEncode } from 'principleware-fe-utilities/src/tools/url';
import {
    transform,
    readerPipeline
} from 'principleware-fe-utilities/src/promise/monadic-operations';

import { observableDecorator } from '../decorators/observable.decorator';
import { IObservable } from '../interfaces/observable.interface';
import { IEventArgs } from '../interfaces/event-args.interface';

const _ = dependencies.underscore;

export interface IXHRCtorOption {
    url: string;
    async?: boolean;
    type?: 'POST' | 'GET',
    content_type: string,
    response_type: string;
    adaptor?: any;
    validator?: any;
    requestheaders: any[];
    params?: any;
    processParams?: any;
}

const defaultOptions = {
    url: '',
    type: 'POST',
    async: true,
    response_type: 'json',
    adaptor: null,
    validator: null,
    requestheaders: []
};

@observableDecorator
export class XHRPromise {

    public settings: IXHRCtorOption;
    public get asObservable(): IObservable {
        const self: any = this;
        return self as IObservable;
    }

    constructor(options: IXHRCtorOption) {
        this.settings = _.extend({}, defaultOptions, options);
    }

    /**
     * Gets the promise for sending out a request.
     */
    sendPromise() {
        const settings = this.settings;
        /**
         * Send out events when rejected.
         */
        const onReject = (args) => {
            const evt = {
                args: args
            };
            this.asObservable.fire('done', evt);
            this.asObservable.fire('error', evt);
            return args;
        };

        /**
         * Send out events when resolved successfully.
         * @private
         * @function onResolve
         */
        const onResolve = (args) => {
            const evt = {
                args: args
            };
            this.asObservable.fire('done', evt);
            this.asObservable.fire('success', evt);
            return args;
        }

        /**
         * Builds a promise for sending requests to the server.
         */
        const requestPromise: (any) => Promise<any> = (data) => {
            return new Promise((resolve, reject) => {
                const xhrSettings = {
                    url: settings.url,
                    content_type: settings.content_type,
                    type: settings.type,
                    data: data,
                    async: settings.async,
                    success: resolve,
                    error: reject,
                    requestheaders: settings.requestheaders
                };
                // Process sent-out data
                if (settings.content_type === 'application/x-www-form-urlencoded') {
                    xhrSettings.data = urlEncode(xhrSettings.data);
                } else if (settings.content_type === 'application/json') {
                    xhrSettings.data = JSON.stringify(xhrSettings.data);
                }
                // event
                this.asObservable.fire('onsend', { args: settings });
                XHR.send(xhrSettings);
            });
        }

        // Some sanity checks
        if (_.isEmpty(settings.url)) {
            throw new Error('url is not defined');
        }

        let params = settings.params;
        if (settings.processParams) {
            params = settings.processParams(params);
        }

        let result = requestPromise(params);
        result.then(onResolve, onReject);
        result = result.then(function(data) {
            if (settings.response_type === 'json') {
                data = JSON.parse(data);
            }
            return data;
        });
        return result;
    }
}
