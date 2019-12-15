pragma solidity ^0.5.14;
pragma experimental ABIEncoderV2;

contract owned {
    constructor() public {owner = msg.sender;}
    address payable owner;

    // This contract only defines a modifier but does not use
    // it: it will be used in derived contracts.
    // The function body is inserted where the special symbol
    // `_;` in the definition of a modifier appears.
    // This means that if the owner calls this function, the
    // function is executed and otherwise, an exception is
    // thrown.
    modifier onlyOwner {
        require(
            msg.sender == owner,
            "Only owner can call this function."
        );
        _;
    }
}

contract mortal is owned {
    // This contract inherits the `onlyOwner` modifier from
    // `owned` and applies it to the `close` function, which
    // causes that calls to `close` only have an effect if
    // they are made by the stored owner.
    function close() public onlyOwner {
        selfdestruct(owner);
    }
}

contract GetLogin {
    struct UserInfo
    {
        bytes32 username;
        bool isActive;
    }

    struct InviteInfo
    {
        address inviteAddress;
        string creatorUsername;
        bool isActive;
    }

    struct UserWallet
    {
        bytes32 username;
        address wallet;
    }

    mapping(bytes32 => UserInfo) public Users;
    mapping(address => InviteInfo) public Invites;
    mapping(bytes32 => UserWallet[]) public UserWallets;

    constructor() public {
       createUser(keccak256('admin'));
    }

    function createInvite(address payable inviteAddress, string memory creatorUsername) public payable {
        // todo check is invite creator registered
        Invites[inviteAddress] = InviteInfo({inviteAddress: inviteAddress, creatorUsername: creatorUsername, isActive: true});
    }

    function createUser(bytes32 usernameHash) public payable {
        // todo check is usernameHash not exists
       Users[usernameHash] = UserInfo({username: usernameHash, isActive: true});
       addWallet(usernameHash, msg.sender);
    }

    function addWallet(bytes32 usernameHash, address wallet) public payable {
        // todo chech is username assigned with sender
        // todo check is wallet already exists
        UserWallets[usernameHash].push(UserWallet({username: usernameHash, wallet: wallet}));
    }

    function getUserInfo(bytes32 usernameHash) public view returns (UserInfo memory){
        return Users[usernameHash];
    }
}
