const GetLoginLogic = artifacts.require("./GetLoginLogic.sol");
const GetLoginStorage = artifacts.require("./GetLoginStorage.sol");
const willFail = require("./exceptions.js").willFail;
let getLoginLogic, getLoginStorage;

const invitedPrivateKey = '0x266a5ee9cd3452d17f71664b21243b22e073250d2283f278b2ca50691dd3081e';
const invitedAddress = '0x957D6F9a75c89982c7ab6cb9D5425Bf050eFe7A2';
const inviteBalance = '1';
const newAccountBalance = '0.5';

contract("GetLogin", async accounts => {
    describe('User', async () => {
        before(async () => {
            getLoginLogic = await GetLoginLogic.deployed();
            getLoginStorage = await GetLoginStorage.deployed();

            await getLoginStorage.setLogicAddress(getLoginLogic.address);
            await getLoginLogic.init();

            await web3.eth.personal.importRawKey(invitedPrivateKey, '123');
            await web3.eth.personal.unlockAccount(invitedAddress, '123', 60 * 60 * 60);
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

        it("Create invite", async () => {
            await getLoginLogic.createInvite(invitedAddress, {
                from: accounts[0],
                value: web3.utils.toWei(inviteBalance, "ether")
            });
            const inviteInfo = await getLoginLogic.getInvite(invitedAddress);
            assert.equal(inviteInfo.inviteAddress, invitedAddress, "Incorrect data");
            assert.equal(inviteInfo.creatorUsername, web3.utils.keccak256('admin'), "Incorrect data");
            assert.equal(inviteInfo.isActive, true, "Incorrect data");
            await willFail(getLoginLogic.createInvite(invitedAddress, {
                from: accounts[0],
                value: web3.utils.toWei(inviteBalance, "ether")
            }), 'This address already used for invite');
        });

        it("Create user from invite", async () => {
            const usernameHash = web3.utils.keccak256('test_invite');
            const newWalletAddress = '0x84ac534e82f501cf64ed403a5a6973fcf5f9aab8';
            const ciphertext = '38755a892bb2c4ac75aaf1ede83ba9ba3acc1272f3a5217ce3cb8f79504a3db5';
            const iv = '10f6bad801ba43f9db305d78313f2c16';
            const salt = 'd4903e348b32844f08efa5aa495f515b240accc13db2a6c82f58c845ff5d0ef9';
            const mac = 'b1fb25e1ff611b30776fcc2df7fc9d5746750075c13f9fcb837b81497d92571b';

            await getLoginLogic.createUserFromInvite(usernameHash, newWalletAddress, ciphertext, iv, salt, mac, {
                from: invitedAddress,
                value: web3.utils.toWei(newAccountBalance, "ether")
            });

            const userInfo = await getLoginLogic.getUserInfo(usernameHash);
            assert.equal(userInfo.username, usernameHash, "Incorrect username hash");
            assert.equal(userInfo.isActive, true, "User not found");

            const inviteInfo = await getLoginLogic.getInvite(invitedAddress);
            assert.equal(inviteInfo.isActive, false, "Incorrect data");
            assert.equal(inviteInfo.registeredUsername, usernameHash, "Incorrect data");

            await willFail(getLoginLogic.createInvite(invitedAddress, {
                from: accounts[0],
                value: web3.utils.toWei(inviteBalance, "ether")
            }), 'This address already used for invite');

            const events = await getLoginStorage.getPastEvents('EventStoreWallet', {
                filter: {
                    username: usernameHash,
                },
                fromBlock: 0
            });
            const eventValues = events[0].returnValues;
            assert.equal(eventValues.username, usernameHash, "Incorrect data");
            assert.equal(eventValues.walletAddress.toLowerCase(), newWalletAddress.toLowerCase(), "Incorrect data");
            assert.equal(eventValues.ciphertext, ciphertext, "Incorrect data");
            assert.equal(eventValues.iv, iv, "Incorrect data");
            assert.equal(eventValues.salt, salt, "Incorrect data");
            assert.equal(eventValues.mac, mac, "Incorrect data");
        });

        it("Change password", async () => {
            const usernameHash = web3.utils.keccak256('test_invite');
            const newWalletAddress = "0x1b3f4d7b5295292663190b0d9ed3cff855ccb713";
            const ciphertext = "c4b7d7283ce9b1b7a68ecba80624cb07129e12c6ecbe11a952c4c1621c575b22";
            const iv = "7275e7c8aa530435d38d90b3ea44bbb2";
            const salt = "6fe33b586719ca639424af83314abb9a59fd0dddc228e69ace7ca5f014245ee5";
            const mac = "964b8fcaf6e1d8cc81571f810b9906ef2c1db0506f4617a7a429cfa531f2f5ae";

            await getLoginLogic.changePassword(usernameHash, newWalletAddress, ciphertext, iv, salt, mac, {
                from: invitedAddress,
                value: web3.utils.toWei(newAccountBalance, "ether")
            });

            // todo check is possible change password from other accounts
            // todo check new account owner
            // todo check address not available for registration and as invite

            const balance1 = await web3.eth.getBalance(invitedAddress);
            console.log(balance1, web3.utils.fromWei(balance1));

            const balance = await web3.eth.getBalance(newWalletAddress);
            console.log(balance, web3.utils.fromWei(balance));
        });
    });
});
