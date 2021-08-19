const Token = artifacts.require("Token");

module.exports = async function (deployer) {
    await deployer.deploy(Token, 'My BZZ', 'sBZZ', 16, '1250000000000000000000000');
    const instance = await Token.deployed();
    console.log(instance);
};
