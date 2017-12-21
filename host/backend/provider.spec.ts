import { GlobalProvider, endPointEnum } from './provider';


describe('provider basic', () => {

    let provider = new GlobalProvider({
        webhost: 'www.peeroffers.com'
    });

    it('ctor', () => {
        expect(provider).toBeDefined();
    });

    it('host', () => {
        expect(provider.host).toEqual('www.peeroffers.com');
    });

    it('add endpoint', () => {
        provider.addEndPoint('filelist', endPointEnum.pagedCollection, {
            url: 'me',
            securityDelegate: (options) => {
            }
        });

        expect(provider.getEndPoint('filelist')).toBeDefined();
    });

    it('destroy', () => {
        provider.destroy();
    });

});


describe('mount working', () => {

    let provider = new GlobalProvider({
        webhost: 'www.peeroffers.com'
    });

    let flag = false;

    beforeEach(function(done) {
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

});

