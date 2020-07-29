const GetLoginLogic = artifacts.require("./GetLoginLogic.sol");
const GetLoginStorage = artifacts.require("./GetLoginStorage.sol");
const TestLogic = artifacts.require("./TestLogic.sol");
const willFail = require("./exceptions.js").willFail;
let getLoginLogic, getLoginStorage, testLogic;
const adminUsernameHash = web3.utils.keccak256('admin');

contract("GetLogin", async accounts => {
    describe('Invite', async () => {
        before(async () => {
            getLoginLogic = await GetLoginLogic.deployed();
            getLoginStorage = await GetLoginStorage.deployed();

            await getLoginStorage.setLogicAddress(getLoginLogic.address);
            await getLoginLogic.init();
        });

        it("Create session", async () => {
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

            const data = await getLoginLogic.createAppSession(info.appId, info.address, info.iv, info.ephemPublicKey, info.ciphertext, info.mac, {
                value: web3.utils.toWei(info.balance, "ether")
            });
            const data2 = await getLoginLogic.createAppSession(info.appId, "0x0000000000000000000000000000000000000000", "", "", "", "",);
            /*console.log(data);
            console.log(data2);*/
        });
    });
});
