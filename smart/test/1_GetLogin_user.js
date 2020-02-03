const GetLogin = artifacts.require("./GetLogin.sol");
const willFail = require("./exceptions.js").willFail;
let getLogin;

contract("GetLogin", async accounts => {
    describe('User', async () => {
        beforeEach(async () => {
            getLogin = await GetLogin.deployed();
        });

        it("Is admin created", async () => {
            const usernameHash = web3.utils.keccak256('admin');
            const app = await getLogin.getUserInfo(usernameHash);

            assert.equal(app.isActive, true, "Admin not created");
        });

        it("Is possible to create user with the same hash again", async () => {
            const usernameHash = web3.utils.keccak256('admin');
            await willFail(getLogin.createUser(usernameHash, {from: accounts[0]}), 'Username already used');
            await willFail(getLogin.createUser(usernameHash, {from: accounts[1]}), 'Username already used');
        });

        it("Create new user without invite", async () => {
            const usernameHash = web3.utils.keccak256('igor');
            await getLogin.createUser(usernameHash, {from: accounts[1]});
        });

        it("Create new user from old address", async () => {
            const usernameHash = web3.utils.keccak256('igor1');
            await willFail(getLogin.createUser(usernameHash, {from: accounts[1]}), 'Wallet already used');
        });
    });
});
