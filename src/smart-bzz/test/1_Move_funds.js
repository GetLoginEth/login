const Token = artifacts.require("./Token.sol");

let token;

contract("Token", async accounts => {
    describe('Move', async () => {
        before(async () => {
            token = await Token.deployed();
        });

        it("Is admin created", async () => {
            let data = await token.name();
            console.log('data', data);
        });
    });
});
