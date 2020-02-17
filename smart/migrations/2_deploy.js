const GetLogin = artifacts.require("GetLogin");
const AppStorage = artifacts.require("AppStorage");
const AppRegistry = artifacts.require("AppRegistry");
const AppLogicOne = artifacts.require("AppLogicOne");

module.exports = function(deployer) {
  deployer.deploy(GetLogin);
  deployer.deploy(AppStorage);
  deployer.deploy(AppRegistry);
  deployer.deploy(AppLogicOne);
};
