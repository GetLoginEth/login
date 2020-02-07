const GetLogin = artifacts.require("./GetLogin.sol");
const willFail = require("./exceptions.js").willFail;
let getLogin;

contract("GetLogin", async accounts => {
    describe('App', async () => {
        before(async () => {
            getLogin = await GetLogin.deployed();
            const usernameHash = web3.utils.keccak256('igor');
            await getLogin.createUser(usernameHash, {from: accounts[1]});
        });

        beforeEach(async () => {
            getLogin = await GetLogin.deployed();
        });

        it("Is first app created", async () => {
            const app = await getLogin.getApplication(1);

            assert.equal(app.id, "1", "First app not created");
        });

        it("Can create new app", async () => {
            const appId = 2;

            const title = "Truffle app";
            const description = "Simple truffle app";
            await getLogin.createApplication(title, description, [], []);
            const app = await getLogin.getApplication(appId);

            assert.equal(app.id, appId, "App not found");
            assert.equal(app.title, title, "Incorrect app title");
            assert.equal(app.description, description, "Incorrect app title");
        });

        it("Is possible to add urls to app", async () => {
            const appId = 2;
            const newUrls = ["https://hello.world", "https://hello.world/test/test/123", "https://ya.com/test/test/",];
            let app = await getLogin.getApplication(appId);
            assert.equal(app.allowedUrls.length, 0, "Urls list is not empty");

            let i = 1;
            for (let url of newUrls) {
                await getLogin.addApplicationUrl(appId, url, {from: accounts[0]});
                app = await getLogin.getApplication(appId);
                assert.equal(app.allowedUrls.length, i, "Urls list size is not correct");
                i++;
            }

            app = await getLogin.getApplication(appId);
            for (let i = 0; i < app.allowedUrls.length; i++) {
                assert.equal(app.allowedUrls[i], newUrls[i], "Incorrect url by index");
            }
        });

        it("Can edit app", async () => {
            const appId = 2;
            const title = "Wow! New Great App";
            const description = "Oxoxo. 9000. Great description";
            const allowedUrls = ['https://one.com/123', 'https://ya.com/321', 'https://google.com/777',];
            const allowedContracts = ['0xD66521103Cb882d6afEb051Ae3e986506Af56409', '0x25a7D3AD29dba10BE86496B1D6367224B06123D2', '0xbe171aa7da559a655e4b7a603ca335716864439d',];

            await getLogin.editApplication(appId, title, description, allowedUrls, allowedContracts);
            const app = await getLogin.getApplication(appId);
            assert.equal(app.title, title, "Incorrect app title");
            assert.equal(app.description, description, "Incorrect app title");
            assert.equal(app.allowedUrls.length, allowedUrls.length, "Incorrect size of allowedUrls");
            assert.equal(app.allowedContracts.length, allowedContracts.length, "Incorrect size of allowedContracts");

            for (let i = 0; i < allowedUrls.length; i++) {
                const url = app.allowedUrls[i];
                const expectedUrl = allowedUrls[i];
                assert.equal(url, expectedUrl, "Incorrect url");
            }

            for (let i = 0; i < allowedContracts.length; i++) {
                const contract = app.allowedContracts[i].toLowerCase();
                const expectedContract = allowedContracts[i].toLowerCase();
                assert.equal(contract, expectedContract, "Incorrect contract");
            }
        });

        it("Can delete app urls and contracts", async () => {
            const newAppIdExpected = 3;
            const title = "Third app";
            const description = "Yeah. New app";
            const newUrls = ["https://hello.world", "https://hello.world/test/test/123", "https://ya.com/test/test/",];
            const newContracts = ["0xD66521103Cb882d6afEb051Ae3e986506Af56409", "0xD66521103Cb882d6afEb051Ae3e986506Af56409",];

            const newApp = await getLogin.createApplication(title, description, newUrls, newContracts);
            const appId = newApp.logs[0].args.appId.toString();
            assert.equal(appId, newAppIdExpected, "Incorrect app id");

            let app = await getLogin.getApplication(appId);
            assert.equal(app.allowedUrls.length, newUrls.length, "Incorrect urls length");
            assert.equal(app.allowedContracts.length, newContracts.length, "Incorrect contracts length");

            for (let i = 0; i < newUrls.length; i++) {
                await getLogin.deleteApplicationUrl(appId, i);
            }

            app = await getLogin.getApplication(appId);
            for (let url of app.allowedUrls) {
                assert.equal(url, "", "Incorrect url");
            }

            // check contract deletion
            for (let i = 0; i < newContracts.length; i++) {
                await getLogin.deleteApplicationContract(appId, i);
            }

            app = await getLogin.getApplication(appId);
            for (let contract of app.allowedContracts) {
                assert.equal(contract, "0x0000000000000000000000000000000000000000", "Incorrect contract");
            }
        });

        it("Rename app from other account", async () => {
            const appId = 2;
            const title = "Info from new user";
            const description = "Absolutely great description";
            const app = await getLogin.getApplication(appId);
            await willFail(getLogin.editApplication(appId, title, description, app.allowedUrls, app.allowedContracts, {from: accounts[1]}), 'You do not have access to this application');
        });

        it("Add url from other account", async () => {
            const appId = 2;
            await willFail(getLogin.addApplicationUrl(appId, 'https://hello.world', {from: accounts[1]}), 'You do not have access to this application');
        });

        it("Delete url from other account", async () => {
            const appId = 2;
            await willFail(getLogin.deleteApplicationUrl(appId, 0, {from: accounts[1]}), 'You do not have access to this application');
        });

        it("Delete application", async () => {
            const appId = 2;
            await getLogin.deleteApplication(appId);
            await willFail(getLogin.getApplication(appId), 'App not found');
            await willFail(getLogin.addApplicationUrl(appId, 'https://hello.world'), 'App not found');
            await willFail(getLogin.addApplicationUrl(appId, 'https://hello.world', {from: accounts[1]}), 'App not found');
        });

        it("Restore application", async () => {
            const appId = 2;
            await getLogin.restoreApplication(appId);
            await getLogin.getApplication(appId);
            await getLogin.addApplicationUrl(appId, 'https://hello.world');
            await willFail(getLogin.addApplicationUrl(appId, 'https://hello.world', {from: accounts[1]}), 'You do not have access to this application');
        });
    });
});
