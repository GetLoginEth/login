pragma solidity ^0.6.1;

contract AppStorage {
    address owner;
    address logicAddress;

    string public val;

    constructor () public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    modifier onlyLogicAddress() {
        require(msg.sender == logicAddress, "Caller is not the logic address");
        _;
    }

    function setLogicAddress(address _address) onlyOwner public {
        logicAddress = _address;
    }

    function setVal(string memory _val) onlyLogicAddress public {
        val = _val;
    }
}
