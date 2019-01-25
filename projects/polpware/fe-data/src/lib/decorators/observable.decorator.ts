//
// Author:: Tom Tang <principlewar@gmail.com>
// Copyright:: Copyright (c) 2017, Xiaolong Tang
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// Except as contained in this notice, the name(s) of the above copyright
// holders shall not be used in advertising or otherwise to promote the
// sale, use or other dealings in this Software without prior written
// authorization.


import * as EventDispatcher from 'polpware-tinymce-tailor/src/util/EventDispatcher';

import { IEventArgs } from '../interfaces/event-args.interface';

const getEventDispatcher = function(obj) {
    if (!obj._eventDispatcher) {
        obj._eventDispatcher = new EventDispatcher({
            scope: obj,
            toggleEvent: function(name, state) {
                if (EventDispatcher.isNative(name) && obj.toggleNativeEvent) {
                    obj.toggleNativeEvent(name, state);
                }
            }
        });
    }

    return obj._eventDispatcher;
};

export function observableDecorator<T extends { new (...args: any[]) }>(constructor: T) {
    return class extends constructor {

        public fire<U>(name: string, evt: IEventArgs<U>, bubble?: boolean): IEventArgs<U> {
            const self = this;

            // Prevent all events except the remove event after the instance has been removed
            if (self.removed && name !== 'remove') {
                return null;
            }

            const newEvt = getEventDispatcher(self).fire(name, evt, bubble);

            // Bubble event up to parents
            if (bubble !== false && self.parent) {
                let parent = self.parent();
                while (parent && !newEvt.isPropagationStopped()) {
                    parent.fire(name, newEvt, false);
                    parent = parent.parent();
                }
            }

            return newEvt;
        }


        public on(name: string, callback: (...args: any[]) => any, prepend?: boolean): any {
            return getEventDispatcher(this).on(name, callback, prepend);
        }

        public off(name: string, callback: (...args: any[]) => any): any {
            return getEventDispatcher(this).off(name, callback);
        }

        public once(name: string, callback: (...args: any[]) => any): any {
            return getEventDispatcher(this).once(name, callback);
        }

        public hasEventListeners(name: string): boolean {
            return getEventDispatcher(this).has(name);
        }
    };
}
