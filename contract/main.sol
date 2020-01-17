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

    event EventStoreWallet(bytes32 indexed username, address indexed walletAddress, string ciphertext, string iv, string salt, string mac);

    struct UserInfo
    {
        bytes32 username;
        bool isActive;
    }

    struct InviteInfo
    {
        address inviteAddress;
        bytes32 creatorUsername;
        bool isActive;
    }

    struct UserWallet
    {
        bytes32 username;
        address wallet;
    }

    struct Application
    {
        uint256 id;
        string title;
        string description;
        bytes32 username;
    }

    uint256 public applicationId = 1;
    mapping(bytes32 => UserInfo) public Users;
    mapping(address => InviteInfo) public Invites;
    mapping(bytes32 => UserWallet[]) public UserWallets;
    mapping(uint256 => Application) public Applications;

    constructor() public {
        bytes32 username = keccak256('admin');
        createUser(username);
        createApplication('GetLogin', 'GetLogin - auth app', username);
    }

    function createInvite(address payable inviteAddress, bytes32 creatorUsername) public payable {
        // todo check is invite creator registered
        Invites[inviteAddress] = InviteInfo({inviteAddress: inviteAddress, creatorUsername: creatorUsername, isActive: true});
    }

    function createApplication(string memory title, string memory description, bytes32 creatorUsername) public payable {
        // todo implement
        Applications[applicationId] = Application({id: applicationId, title: title, description: description, username: creatorUsername});
        applicationId++;
    }

    function createUser(bytes32 usernameHash) public payable {
        // todo check is usernameHash not exists
       Users[usernameHash] = UserInfo({username: usernameHash, isActive: true});
       addWallet(usernameHash, msg.sender);
    }

    function createUserFromInvite(bytes32 usernameHash, address walletAddress, string memory ciphertext, string memory iv, string memory salt, string memory mac) public payable {
       // todo check is sender can register
       // todo disable sender for reg
       createUser(usernameHash);
       emit EventStoreWallet(usernameHash, walletAddress, ciphertext, iv, salt, mac);
    }

    function addWallet(bytes32 usernameHash, address wallet) public payable {
        // todo check is username assigned with sender
        // todo check is wallet already exists
        UserWallets[usernameHash].push(UserWallet({username: usernameHash, wallet: wallet}));
    }

    function getUserInfo(bytes32 usernameHash) public view returns (UserInfo memory){
        return Users[usernameHash];
    }
}
