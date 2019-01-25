export interface INgZoneLike {
    runOutsideAngular<T>(fn: (...args: any[]) => T): T;
}
