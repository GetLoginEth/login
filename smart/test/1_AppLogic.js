//const AppRegistry = artifacts.require("./AppRegistry.sol");
const AppLogicOne = artifacts.require("./AppLogicOne.sol");
const AppStorage = artifacts.require("./AppStorage.sol");
const GetLoginLogic = artifacts.require("./GetLoginLogic.sol");
const GetLoginStorage = artifacts.require("./GetLoginStorage.sol");
const willFail = require("./exceptions.js").willFail;
let /*appRegistry,*/ appLogicOne, appStorage, getLoginLogic, getLoginStorage;

contract("AppLogic", async accounts => {
    describe('User', async () => {
        beforeEach(async () => {
            //appRegistry = await AppRegistry.deployed();
            appLogicOne = await AppLogicOne.deployed();
            appStorage = await AppStorage.deployed();
            getLoginLogic = await GetLoginLogic.deployed();
            getLoginStorage = await GetLoginStorage.deployed();
        });

        it("First", async () => {
            await getLoginStorage.setLogicAddress(getLoginLogic.address);
            await getLoginLogic.init();
            const data = await getLoginStorage.getUser(web3.utils.keccak256('admin'));
            console.log(data);
        });

        /*it("Is possible to create user with the same hash again", async () => {
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
        });*/
    });
});
