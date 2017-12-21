export interface IPolicyCtorOptions {
    url: string;
}

export interface IAuthPolicyCtorOptions extends IPolicyCtorOptions {
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
