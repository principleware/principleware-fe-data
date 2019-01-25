/**
 * @fileOverview
 * Provides the anti-forgery security policy.
 * @name AntiForgeryKeyPolicy.js
 * @author Xiaolong Tang <xxlongtang@gmail.com>
 * @license Copyright @me
 */
import * as dependencies from '@polpware/fe-dependencies';

import { liftWithGuard } from '@polpware/fe-utilities';

import { IAntiForgeryKeyCtorOptions } from './interfaces';

import { PolicyBase } from './policy-base';

const $ = dependencies.jquery;
const defaultAntiForgeryKey = '__RequestVerificationToken';
const defaultElementTag = '';

/*
 <input name="__RequestVerificationToken" type="hidden"
 value="J8kl6w7KaBAteKOPeHW1IlG9RS7abCkbvQf2GwBlMVZZOX9FF-Bhc5mYmqXw4qe0MLraucQtKC-TAVh1rJEZ0SDfeLfqp-L5JrthIM9V0gp76-jnVz9J-rdYFhVeTT4Y0">
 */
function getTokenInternal(url: string, elementTag: string, inputField: string): PromiseLike<string> {
    return $.ajax({
        url: url, // A page containing required tokens
        dataType: 'html text'
    }).then(function(data) {
        /*global DOMParser */
        let doc, token, elm;
        token = '';
        doc = new DOMParser().parseFromString(data, 'text/html');
        if (elementTag) {
            elm = $(doc).find(elementTag);
            if (elm.length > 0) {
                elm = $(doc).find(inputField);
                if (elm.length > 0) {
                    elm = elm.eq(0);
                    token = elm.attr('value');
                }
            }
        } else {
            elm = $(doc).find(inputField);
            if (elm.length > 0) {
                elm = elm.eq(0);
                token = elm.attr('value');
            }
        }
        return token;
    });
}

export class AntiForgeryKeyPolicy extends PolicyBase {

    private _antiForgeryKey: string;
    private _elementTag: string;
    private _expired: boolean;

    /**
     * @constructor AntiForgeryKeyPolicy
     * @param {Object} [settings] A set of settings.
     */
    constructor(settings: IAntiForgeryKeyCtorOptions) {
        super(settings);
        this._antiForgeryKey =
            settings.antiForgeryKey || defaultAntiForgeryKey;
        this._elementTag = settings.elementTag || defaultElementTag;
        this._expired = true;
    }

    isExpired(): boolean {
        return this._expired;
    }

    inputField(): string {
        return 'input[name="' + this._antiForgeryKey + '"]';
    }

    /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     * @function readFrom
     * @param {Object} settings
     * @returns {Object}
     */
    readFrom(settings) {
        this.token = settings.token;
    }

    /**
     * Returns the object that are persistentable.
     * @function persistent
     * @returns {Object}
     */
    persistent() {
        return {
            token: this.token
        };
    }

    /**
     * Gets the anti-forgery token from the given url
     * or the instance url.
     * @function getTokenP
     * @param {String}[url] The URL where the response from it may contain
     * the anti-forgery token; it is optional and used when you want to
     * overwrite the instance url.
     * @returns {Promise}
     * @throws {}
     */
    getTokenInternal(): PromiseLike<string> {
        const ret = getTokenInternal(this.url, this._elementTag, this.inputField());
        const p = liftWithGuard(ret, function(token) {
            const isGoodToken = token && token.length > 0;
            this._expired = !isGoodToken;
            return isGoodToken;
        });
        return ret;
    }

    /**
     * Applys the anti-forgery key and its value to the given options.
     * @function apply
     * @param {Object} options The options to be used for making a request.
     */
    applyTo(options) {
        const data = options.data;
        data[this._antiForgeryKey] = this.token;
    }

    /**
     * Apply security policy to the given options.
     * @function applyToV2
     * @param {Object} options A params field is expected.
     */
    applyToV2(options) {
        options.params = options.params || {};
        options.params[this._antiForgeryKey] = this.token;
    }

    // TODO:
    applyToV3(options) {
    }

    /**
     * Resets the token and expired flag
     * @function reset
     */
    reset() {
        super.reset();
        this._expired = true;
    }
}
