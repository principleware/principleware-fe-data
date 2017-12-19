import * as EventDispatcher from 'principleware-tinymce-tailor/util/EventDispatcher';

import { IEventArgs } from './interfaces';

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

export function observableDecorator<T extends { new(...args: any[]) }>(constructor: T) {
    return class extends constructor {

        public fire(name: string, args?: IEventArgs, bubble?: boolean): IEventArgs {
            const self = this;

            // Prevent all events except the remove event after the instance has been removed
            if (self.removed && name !== 'remove') {
                return args;
            }

            args = getEventDispatcher(self).fire(name, args, bubble);

            // Bubble event up to parents
            if (bubble !== false && self.parent) {
                let parent = self.parent();
                while (parent && !args.isPropagationStopped()) {
                    parent.fire(name, args, false);
                    parent = parent.parent();
                }
            }

            return args;
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
