export interface IPolicyCtorOptions {
    url: string;
}

export interface IOAuthTokenPolicyCtorOptions extends IPolicyCtorOptions {
    clientId: string;
    clientSecret: string;
    scope: string;
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

export const DummyOAuthTokenCtorParams: IOAuthTokenPolicyCtorOptions = {
    url: 'dummy',
    clientId: 'dummy',
    clientSecret: 'dummy',
    scope: 'all'
};
