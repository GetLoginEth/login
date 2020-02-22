const GetLoginLogic = artifacts.require("./GetLoginLogic.sol");
const GetLoginStorage = artifacts.require("./GetLoginStorage.sol");
const willFail = require("./exceptions.js").willFail;
let getLoginLogic, getLoginStorage;

contract("GetLogin", async accounts => {
    describe('User', async () => {
        before(async () => {
            getLoginLogic = await GetLoginLogic.deployed();
            getLoginStorage = await GetLoginStorage.deployed();

            await getLoginStorage.setLogicAddress(getLoginLogic.address);
            await getLoginLogic.init();
        });

        beforeEach(async () => {
            /*getLoginLogic = await GetLoginLogic.deployed();
            getLoginStorage = await GetLoginStorage.deployed();*/
        });

        it("Is admin created", async () => {
            await getLoginStorage.setLogicAddress(getLoginLogic.address);
            await getLoginLogic.init();

            const usernameHash = web3.utils.keccak256('admin');
            const app = await getLoginLogic.getUserInfo(usernameHash);

            assert.equal(app.isActive, true, "Admin not created");
        });

        it("Is possible to create user with the same hash again", async () => {
            const usernameHash = web3.utils.keccak256('admin');
            await willFail(getLoginLogic.createUser(usernameHash, {from: accounts[0]}), 'Username already used');
            await willFail(getLoginLogic.createUser(usernameHash, {from: accounts[1]}), 'Username already used');
        });

        it("Create new user without invite", async () => {
            const usernameHash = web3.utils.keccak256('igor');
            await getLoginLogic.createUser(usernameHash, {from: accounts[1]});
        });

        it("Create new user from old address", async () => {
            const usernameHash = web3.utils.keccak256('igor1');
            await willFail(getLoginLogic.createUser(usernameHash, {from: accounts[1]}), 'Wallet already used');
        });
    });
});
