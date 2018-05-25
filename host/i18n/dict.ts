/**
 * @fileOverview
 * Provides i18n service. This module is designed as
 * a delegate of the tinymce I18n service.
 * @author Xiaolong Tang <xxlongtang@gmail.com>
 * @license Copyright @me
 */
import * as _i18n from 'polpware-tinymce-tailor/src/util/I18n';

export class I18n {

    static getDictByCode(code: string) {
        return _i18n.data[code];
    }

    /**
     * Add a languge dictionary and set the current
     * code as the current language.
     */
    static add(code: string, items: any) {
        _i18n.add(code, items);
    }

    /**
     * Trnsaltes a given text. If the given text
     * is missing in the dictionary, use the given default value.
     * @function translate
     * @param {String} text A text to be translated.
     * @param {String} defaultText The default value.
     * @returns {String} The translation for the given text.
     */
    static translate(text: string, defaultText: string) {
        const value = _i18n.translate(text);
        if (value === text && defaultText) {
            return defaultText;
        }
        return value;
    }

    /**
     * Removes unused languages to release memory.
     * @function recycleOthers
     * @param {String} code The language code which should not released.
     */
    static recycleOthers(code: string) {
        const data = _i18n.data;
        const recycleList = [];
        for (const key in data) {
            // skip loop if the property is from prototype
            if (data.hasOwnProperty(key) && key !== code) {
                recycleList.push(key);
            }
        }
        /*jslint plusplus: true */
        for (let i = 0; i < recycleList.length; i++) {
            const k = recycleList[i];
            delete data[k];
        }
    }
}
