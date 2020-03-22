const GetLoginLogic = artifacts.require("./GetLoginLogic.sol");
const GetLoginStorage = artifacts.require("./GetLoginStorage.sol");
const willFail = require("./exceptions.js").willFail;
let getLoginLogic, getLoginStorage;

const demoAccounts = {
    invite: {
        address: '0x957D6F9a75c89982c7ab6cb9D5425Bf050eFe7A2',
        privateKey: '0x266a5ee9cd3452d17f71664b21243b22e073250d2283f278b2ca50691dd3081e',
        balance: '3'
    },
    createdWithInvite: {
        address: "0xe2b28AF05777125db26CEBB8EDB4844889675938",
        privateKey: "0xb430c4f16eb71c166b533476bd076c4898e9101f4c9da338af5dccb68620d977",
        ciphertext: "9719a8265f5a57e5b832850e713d7002e7658e0e8eef06355ccbadd24fc17e26",
        iv: "8ff7f0b9a85dcd391596067fd518ed71",
        salt: "b1027ab58816c2ed83ff6248234e0aabf10a8f6f631e0cfc477c4d5311e57f70",
        mac: "4c4b94429e6920ac0e9677d4d10c744ab1f1f287247ae3546704f7ec6a8ddd61",
        balance: '2'
    },
    changePassword: {
        address: "0xbA29b40E0BC3F5166C265795AbA58BF5d7962c52",
        privateKey: "0x962c1fbd326b3781d372497abda083222be2aa545a982b535867f4ac24c2ed14",
        ciphertext: "7484e66ef15bb481e02a228d754132d7c597b9f8fafc618be67bc150e9f6fa1b",
        iv: "4ac2b96f257131ef74a9aeea45836e9d",
        salt: "4e54660f3062d56610dcf0871e8fd45356cc8da7ab14eb9f54eb9396fe83c869",
        mac: "ed110af146ef9f9ed8081ef4861e37dccefb2ce319f272176030ba48cd262e9d",
        balance: '1'
    }
};

contract("GetLogin", async accounts => {
    describe('User', async () => {
        before(async () => {
            getLoginLogic = await GetLoginLogic.deployed();
            getLoginStorage = await GetLoginStorage.deployed();

            await getLoginStorage.setLogicAddress(getLoginLogic.address);
            await getLoginLogic.init();

            for (const key in demoAccounts) {
                const account = demoAccounts[key];
                if ("privateKey" in account && "address" in account) {
                    await web3.eth.personal.importRawKey(account.privateKey, '123');
                    await web3.eth.personal.unlockAccount(account.address, '123', 60 * 60 * 60);
                }
            }
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
            const account = demoAccounts.invite;
            await getLoginLogic.createInvite(account.address, {
                from: accounts[0],
                value: web3.utils.toWei(account.balance, "ether")
            });
            const inviteInfo = await getLoginLogic.getInvite(account.address);
            assert.equal(inviteInfo.inviteAddress, account.address, "Incorrect data");
            assert.equal(inviteInfo.creatorUsername, web3.utils.keccak256('admin'), "Incorrect data");
            assert.equal(inviteInfo.isActive, true, "Incorrect data");
            await willFail(getLoginLogic.createInvite(account.address, {
                from: accounts[0],
                value: web3.utils.toWei(demoAccounts.invite.balance, "ether")
            }), 'This address already used for invite');
        });

        it("Create user from invite", async () => {
            const usernameHash = web3.utils.keccak256('test_invite');
            const account = demoAccounts.createdWithInvite;
            await getLoginLogic.createUserFromInvite(usernameHash, account.address, account.ciphertext, account.iv, account.salt, account.mac, true, {
                from: demoAccounts.invite.address,
                value: web3.utils.toWei(account.balance, "ether")
            });

            const userInfo = await getLoginLogic.getUserInfo(usernameHash);
            assert.equal(userInfo.username, usernameHash, "Incorrect username hash");
            assert.equal(userInfo.isActive, true, "User not found");

            const inviteInfo = await getLoginLogic.getInvite(demoAccounts.invite.address);
            assert.equal(inviteInfo.isActive, false, "Incorrect isActive");
            assert.equal(inviteInfo.inviteAddress, demoAccounts.invite.address, "Incorrect inviteAddress");
            assert.equal(inviteInfo.registeredUsername, usernameHash, "Incorrect registeredUsername");

            const events = await getLoginStorage.getPastEvents('EventStoreWallet', {
                filter: {
                    username: usernameHash,
                },
                fromBlock: 0
            });
            const eventValues = events[0].returnValues;
            assert.equal(eventValues.username, usernameHash, "Incorrect username");
            assert.equal(eventValues.walletAddress.toLowerCase(), account.address.toLowerCase(), "Incorrect walletAddress");
            assert.equal(eventValues.ciphertext, account.ciphertext, "Incorrect ciphertext");
            assert.equal(eventValues.iv, account.iv, "Incorrect iv");
            assert.equal(eventValues.salt, account.salt, "Incorrect salt");
            assert.equal(eventValues.mac, account.mac, "Incorrect mac");
        });

        it("Create invite with the same address", async () => {
            await willFail(getLoginLogic.createInvite(demoAccounts.invite.address, {
                from: accounts[0],
                value: web3.utils.toWei(demoAccounts.invite.balance, "ether")
            }), 'This address already used for invite');
        });

        it("Change password", async () => {
            const usernameHash = web3.utils.keccak256('test_invite');
            const account = demoAccounts.changePassword;

            await getLoginLogic.changePassword(account.address, account.ciphertext, account.iv, account.salt, account.mac, [], {
                from: demoAccounts.createdWithInvite.address,
                value: web3.utils.toWei(account.balance, "ether")
            });

            // todo why so big price for tx?

            const events = await getLoginStorage.getPastEvents('EventStoreWallet', {
                filter: {
                    username: usernameHash,
                },
                fromBlock: 0
            });

            assert.equal(events.length, 2, "Incorrect events size");
            const firstAccountValues = events[0].returnValues;
            // get last event for account
            const eventValues = events[events.length - 1].returnValues;
            assert.equal(eventValues.username, usernameHash, "Incorrect username");
            assert.equal(eventValues.walletAddress.toLowerCase(), account.address.toLowerCase(), "Incorrect walletAddress");
            assert.equal(eventValues.ciphertext, account.ciphertext, "Incorrect ciphertext");
            assert.equal(eventValues.iv, account.iv, "Incorrect iv");
            assert.equal(eventValues.salt, account.salt, "Incorrect salt");
            assert.equal(eventValues.mac, account.mac, "Incorrect mac");

            assert.notEqual(firstAccountValues.walletAddress.toLowerCase(), eventValues.walletAddress.toLowerCase(), "Incorrect new account");
            assert.equal(firstAccountValues.walletAddress.toLowerCase(), demoAccounts.createdWithInvite.address.toLowerCase(), "Incorrect old account");

            // check new account owner
            const checkUsernameHash = await getLoginLogic.getUsernameByAddress(account.address);
            assert.equal(checkUsernameHash, usernameHash, "Incorrect owner");

            await willFail(getLoginLogic.getUsernameByAddress(demoAccounts.createdWithInvite.address), "User with this address not found");
        });

        /*it("Address is not available for registration and as invite", async () => {
            // todo check address not available for registration and as invite

        });*/

        it("Check settings set", async () => {
            const testString = "we5htw56hw45h45h4 q345 24q5 hw4 hw4 5h q45h 45";
            await getLoginLogic.setInviteReset(testString, {from: accounts[0]});
            const data = await getLoginLogic.getSettings(accounts[0], "invite_reset");
            assert.equal(data, testString, "Incorrect data");
        });

        // todo check reset by invite
    });
});
