const GetLoginStorage = artifacts.require("GetLoginStorage");
const GetLoginLogic = artifacts.require("GetLoginLogic");
const TestLogic = artifacts.require("TestLogic");

module.exports = async function (deployer) {
    await deployer.deploy(GetLoginStorage);
    const storageInstance = await GetLoginStorage.deployed();
    await deployer.deploy(GetLoginLogic, storageInstance.address);
    const logicInstance = await GetLoginLogic.deployed();
    await deployer.deploy(TestLogic);

    await storageInstance.setLogicAddress(logicInstance.address);
};
