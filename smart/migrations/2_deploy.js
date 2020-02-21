const GetLoginStorage = artifacts.require("GetLoginStorage");
const GetLoginLogic = artifacts.require("GetLoginLogic");
const AppStorage = artifacts.require("AppStorage");
//const AppRegistry = artifacts.require("AppRegistry");
const AppLogicOne = artifacts.require("AppLogicOne");

module.exports = function (deployer) {
    deployer.deploy(GetLoginStorage).then(data => {
        deployer.deploy(GetLoginLogic, data.address)
            .then(data => {
                //GetLoginStorage.setLogicAddress(data.address);
            });
    });
    deployer.deploy(AppStorage);
    deployer.deploy(AppLogicOne);
};
