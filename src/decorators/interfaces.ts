export interface IEventArgs {
    isPropagationStopped?: () => boolean;
}

export interface IObservable {
    fire(name: string, args?: IEventArgs, bubble?: boolean): IEventArgs;
    on(name: string, callback: (...args: any[]) => any, prepend?: boolean): any;
    off(name: string, callback: (...args: any[]) => any): any;
    once(name: string, callback: (...args: any[]) => any): any;
    hasEventListeners(name: string): boolean;
}

