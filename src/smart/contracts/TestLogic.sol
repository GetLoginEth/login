// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import './GetLoginStorage.sol';

contract TestLogic {
    GetLoginStorage public getLoginStorage;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    function setOwner(address _address) onlyOwner public {
        owner = _address;
    }

    function setStorageAddress(GetLoginStorage _address) onlyOwner public {
        getLoginStorage = _address;
    }

    constructor(/*GetLoginStorage _getLoginStorage*/) {
        owner = msg.sender;
        /*getLoginStorage = _getLoginStorage;*/
    }

    function renameApp(uint64 appId) public {
        GetLoginStorage.Application memory app = getLoginStorage.getApplication(appId);
        app.title = "Renamed";
        getLoginStorage.setApplication(appId, app);
    }
}
