const GetLoginStorage = artifacts.require("GetLoginStorage");
const GetLoginLogic = artifacts.require("GetLoginLogic");
const Empty = artifacts.require("Empty");
const TestLogic = artifacts.require("TestLogic");

module.exports = function (deployer) {
    deployer.deploy(GetLoginStorage).then(data => {
        deployer.deploy(GetLoginLogic, data.address)
            .then(data => {
                //GetLoginStorage.setLogicAddress(data.address);
            });
    });

    deployer.deploy(Empty);
    deployer.deploy(TestLogic);
};
