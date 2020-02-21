pragma solidity ^0.6.1;

import './AppStorage.sol';

contract AppLogicOne {
    AppStorage public storageAddress;
    address owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    function setOwner(address _address) onlyOwner public {
        owner = _address;
    }

    function setStorageAddress(AppStorage _address) onlyOwner public {
        storageAddress = _address;
    }

    function setVal(string memory _string) public {
        storageAddress.setVal(_string);
    }
}
