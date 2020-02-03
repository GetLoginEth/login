const GetLogin = artifacts.require("./GetLogin.sol");
const willFail = require("./exceptions.js").willFail;
let getLogin;

contract("GetLogin", async accounts => {
    describe('App', async () => {
        beforeEach(async () => {
            getLogin = await GetLogin.deployed()
        });

        it("Is first app created", async () => {
            const app = await getLogin.getApplication(1);

            assert.equal(app.id, "1", "First app not created");
        });

        it("Can create new app", async () => {
            const appId = 2;

            const title = "Truffle app";
            const description = "Simple truffle app";
            await getLogin.createApplication(title, description, {from: accounts[0]});
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

        it("Can rename app", async () => {
            const appId = 2;
            const title = "Wow! New Great App";
            const description = "Oxoxo. 9000. Great description";

            //const getLogin = await GetLogin.deployed();
            await getLogin.renameApplication(appId, title, description, {from: accounts[0]});
            const app = await getLogin.getApplication(appId);
            assert.equal(app.title, title, "Incorrect app title");
            assert.equal(app.description, description, "Incorrect app title");
        });

        it("Can delete app urls", async () => {
            const newAppIdExpected = 3;
            const title = "Third app";
            const description = "Yeah. New app";
            const newUrls = ["https://hello.world", "https://hello.world/test/test/123", "https://ya.com/test/test/",];

            const newApp = await getLogin.createApplication(title, description);
            const appId = newApp.logs[0].args.appId.toString();
            assert.equal(appId, newAppIdExpected, "Incorrect app id");
            let app = await getLogin.getApplication(appId);
            assert.equal(app.allowedUrls.length, 0, "Not empty urls length");
            for (let url of newUrls) {
                await getLogin.addApplicationUrl(appId, url, {from: accounts[0]});
                app = await getLogin.getApplication(appId);
            }

            app = await getLogin.getApplication(appId);
            assert.equal(app.allowedUrls.length, newUrls.length, "Incorrect urls length");

            for (let i = 0; i < newUrls.length; i++) {
                await getLogin.deleteApplicationUrl(appId, i, {from: accounts[0]});
            }

            app = await getLogin.getApplication(appId);
            for (let url of app.allowedUrls) {
                assert.equal(url, "", "Incorrect url");
            }
        });
    });

});
