const GetLoginLogic = artifacts.require("./GetLoginLogic.sol");
const GetLoginStorage = artifacts.require("./GetLoginStorage.sol");
const TestLogic = artifacts.require("./TestLogic.sol");
const willFail = require("./exceptions.js").willFail;
let getLoginLogic, getLoginStorage, testLogic;

contract("GetLogin", async accounts => {
    describe('Invite', async () => {
        before(async () => {
            getLoginLogic = await GetLoginLogic.deployed();
            getLoginStorage = await GetLoginStorage.deployed();
            testLogic = await TestLogic.deployed();
        });

        beforeEach(async () => {
            /*getLoginLogic = await GetLoginLogic.deployed();
            getLoginStorage = await GetLoginStorage.deployed();*/
        });

        it("External logic can not change data", async () => {
            const app = await getLoginStorage.getApplication(1);
            assert.equal(app.title, "GetLogin", "Incorrect title");

            await testLogic.setStorageAddress(getLoginStorage.address);
            await willFail(testLogic.renameApp(1), 'Caller is not the logic address');
        });

        it("After change logic contract address - old contract can't change data", async () => {
            let app = await getLoginStorage.getApplication(1);
            await getLoginStorage.setLogicAddress(testLogic.address);
            await willFail(getLoginLogic.editApplication(1, app.title, app.description, app.allowedUrls, app.allowedContracts), 'Caller is not the logic address');
            await testLogic.renameApp(1);
            app = await getLoginStorage.getApplication(1);
            assert.equal(app.title, "Renamed", "Incorrect title");

            await getLoginStorage.setLogicAddress(getLoginLogic.address);
        });

    });
});
