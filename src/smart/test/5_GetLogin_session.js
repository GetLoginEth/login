const GetLoginLogic = artifacts.require("./GetLoginLogic.sol");
const GetLoginStorage = artifacts.require("./GetLoginStorage.sol");
const TestLogic = artifacts.require("./TestLogic.sol");
const willFail = require("./exceptions.js").willFail;
let getLoginLogic, getLoginStorage, testLogic;
const adminUsernameHash = web3.utils.keccak256('admin');

contract("GetLogin", async accounts => {
    // todo check every contract method with correct and incorrect behaviour
    // todo validate events creation
    const info = {
        appId: "1",
        address: "0x4152737c73239d579187FE3F0E6a9627E9b98B03",
        ephemPublicKey: "test",
        privateKey: "0xc92305caebf147e929ea1f5e96ab56b8754b8b32a7cf78bbfff961a4b350d890",
        ciphertext: "83a05c62c1db4fda30d1705e26a2fc5cf94151fded7854717f2e607144fff48a",
        iv: "25f4c1915a249fdc7e39218ba66da4eb",
        salt: "ced30ffc12299adfc4840edc8e115ca5c64ca3a94188f90f44a28c289d52a7df",
        mac: "cc9605f348a03229f851ca4f8675833872d53751d862340f80e06923d9698096",
        balance: '0.01'
    };

    const newSessionAddress = "0x822907249D6DD918890cC05d8EE3Ea0A3Ab40662";

    describe('Session', async () => {
        before(async () => {
            getLoginLogic = await GetLoginLogic.deployed();
            getLoginStorage = await GetLoginStorage.deployed();
        });

        it("Check sessions index length", async () => {
            const sessionIndex = await getLoginStorage.getAppSessionIndex(adminUsernameHash);
            assert.equal(sessionIndex.length, 0, "Incorrect sessions index count");

            const activeSessions = await getLoginLogic.getActiveAppSessions(adminUsernameHash);
            assert.equal(activeSessions.length, 0, "Incorrect active sessions count");
        });

        it("Create & close session", async () => {
            await getLoginLogic.createAppSession(info.appId, info.address, info.iv, info.ephemPublicKey, info.ciphertext, info.mac, {
                value: web3.utils.toWei(info.balance, "ether")
            });

            let activeSessions = await getLoginLogic.getActiveAppSessions(adminUsernameHash);
            // result array should be filtered because solidity isn't support dynamic arrays
            assert.equal(activeSessions.filter(item => item.isActive).length, 1, "Incorrect active sessions count");

            let usernameByAddress = await getLoginLogic.getUsernameByAddress(info.address);
            assert.equal(usernameByAddress, adminUsernameHash, "Incorrect username by session address");

            let sessionIndex = await getLoginStorage.getAppSessionIndex(adminUsernameHash);
            assert.equal(sessionIndex.length, 1, "Incorrect sessions index count");
            assert.equal(sessionIndex[0], info.appId, "Incorrect sessions index element");

            let appSessions = await getLoginLogic.getAppSessions(info.appId, adminUsernameHash);
            assert.equal(appSessions.length, 1, "Incorrect sessions count");
            assert.equal(appSessions[0].isActive, true, "Incorrect session activity");

            await getLoginLogic.createAppSession(info.appId, newSessionAddress, "", "", "", "",);
            appSessions = await getLoginLogic.getAppSessions(info.appId, adminUsernameHash);
            assert.equal(appSessions.length, 2, "Incorrect sessions count");
            assert.equal(appSessions[0].isActive, false, "Incorrect session activity");
            assert.equal(appSessions[1].isActive, true, "Incorrect session activity");

            await getLoginLogic.closeAppSession(info.appId);
            appSessions = await getLoginLogic.getAppSessions(info.appId, adminUsernameHash);
            assert.equal(appSessions.length, 2, "Incorrect sessions count");
            assert.equal(appSessions[0].isActive, false, "Incorrect session activity");
            assert.equal(appSessions[1].isActive, false, "Incorrect session activity");

            await willFail(getLoginLogic.getUsernameByAddress(info.address), 'Session address should be the same');
            await willFail(getLoginLogic.getUsernameByAddress(newSessionAddress), 'User session address is not active');

            // check is something changed after close
            sessionIndex = await getLoginStorage.getAppSessionIndex(adminUsernameHash);
            assert.equal(sessionIndex.length, 1, "Incorrect sessions index count");

            activeSessions = await getLoginLogic.getActiveAppSessions(adminUsernameHash);
            assert.equal(activeSessions.filter(item => item.isActive).length, 0, "Incorrect active sessions count");
        });
    });
});
