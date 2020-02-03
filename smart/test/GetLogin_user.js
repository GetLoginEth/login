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

        /*it("Create new user without invite", async () => {
            // igor
            const usernameHash = '0x79f83765412a9277d8e547b789add1c2c4f861218677fc27d9bfb4e9c77a1b82';
            const getLogin = await GetLogin.deployed();
            await getLogin.createUser(usernameHash, {from: accounts[1]});

        });*/
    });
});
