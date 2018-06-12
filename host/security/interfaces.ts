export interface IPolicyCtorOptions {
    url: string;
}

export interface IOAuthTokenPolicyCtorOptions extends IPolicyCtorOptions {
    clientId: string;
    clientSecret: string;
    scope: string;
}

export interface IAntiForgeryKeyCtorOptions extends IPolicyCtorOptions {
    antiForgeryKey: string;
    elementTag: string;
}

export interface IOAuthParams {
    client_id: string;
    client_secret: string;
    scope: string;
    grant_type: any;
}

export interface IOAuthToken {
    expiresIn: number;
    createdOn: number;
    token: string;
    refreshToken: string;
}

export interface IOpenIDToken extends IOAuthToken {
    openId: string;
}

export interface IPolicy {
    getTokenInternal(): PromiseLike<string>;

    applyTo(options: any): void;

    isExpired(): boolean;

    readFrom(settings: {});

    persistent(): any;

    applyToV2(options: any): void;

    applyToV3(options: any): void;

    /**
     * The interface for retrieving the token from a remote server.
     * This method internally dispatches the call to another method
     * and cache the token.
     */
    getTokenP(): PromiseLike<string>;

    reset();
}

export const DummyOAuthTokenCtorParams: IOAuthTokenPolicyCtorOptions = {
    url: 'dummy',
    clientId: 'dummy',
    clientSecret: 'dummy',
    scope: 'all'
};
