pragma solidity ^0.5.11;
contract registration
{
    event Registered (
        address indexed _who
    );

    struct regstruct {
        address pubKey;
        bool isValue;
    }

    mapping(bytes32 => regstruct) data;

    function reg(bytes32 loginHash, bytes32 authProof, address pubKey, bytes32 encData) public {
        if (!data[loginHash].isValue) {
            data[loginHash].isValue = true;
            data[loginHash].pubKey = pubKey;
            emit Registered(pubKey);
        }

        if (authProof == 0 && encData == 0)
        {}
    }

    function isReg(bytes32 loginHash) public view returns (bool) {
        return data[loginHash].isValue;
    }
}
