pragma solidity ^0.6.1;

import './AppStorage.sol';

contract AppLogicOne is AppStorage {
    function setVal(string memory _val) public {
        val = _val;
    }
}
