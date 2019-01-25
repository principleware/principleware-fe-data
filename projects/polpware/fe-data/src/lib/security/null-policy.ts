import { lift } from '@polpware/fe-utilities';

import { IPolicy } from './interfaces';

export class NullPolicy implements IPolicy {

    getTokenInternal(): PromiseLike<string> {
        throw new Error('NotImplemented');
    }

    applyTo(options: any): void { }

    isExpired(): boolean {
        return false;
    }

    readFrom(settings: {}) { }


    persistent(): any { }

    applyToV2(options: any): void { }

    applyToV3(options: any): void { }

    getTokenP(): PromiseLike<string> {
        throw new Error('NotImplemented');
    }

    reset() { }
}
