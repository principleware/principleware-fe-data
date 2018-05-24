import { GlobalProvider, endPointEnum } from './provider';


describe('provider basic', () => {

    const provider = new GlobalProvider({
        webhost: 'www.peeroffers.com1'
    });

    it('ctor', () => {
        expect(provider).toBeDefined();
    });

    it('host', () => {
        expect(provider.host).toEqual('www.peeroffers.com1');
    });

    it('add endpoint', () => {
        provider.addEndPoint('filelist', endPointEnum.pagedCollection, {
            url: 'me',
            securityDelegate: (options) => {
            }
        });

        expect(provider.getEndPoint('filelist')).toBeDefined();
    });

    afterAll(() => {
        provider.destroy();
    });

});

describe('provider can be destoryed', () => {

    const provider = new GlobalProvider({
        webhost: 'www.peeroffers.com2'
    });

    it('destroy', () => {
        provider.destroy();
        expect(provider.host).toBeNull();
    });

});



describe('mount working', () => {

    const provider = new GlobalProvider({
        webhost: 'www.peeroffers.com3'
    });

    let flag = false;

    beforeAll(function(done) {
        provider.addEndPoint('filelist', endPointEnum.pagedCollection, {
            url: 'https://www.nxdrive.com',
            securityDelegate: (options) => {
                flag = true;
                done();
            }
        });
        const Ctor = provider.getEndPoint('filelist');
        const pCollection = new Ctor();

        pCollection.getFirstPage();
    });

    it('securityDelegate working', (done) => {
        expect(flag).toBeTruthy();
        done();
    });

    afterAll(() => {
        provider.destroy();
    });


});

