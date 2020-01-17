pragma solidity ^0.5.14;
pragma experimental ABIEncoderV2;

contract owned {
    address payable owner;
    constructor() public {owner = msg.sender;}

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

contract GetLogin is mortal {
    event EventStoreWallet(bytes32 indexed username, address indexed walletAddress, string ciphertext, string iv, string salt, string mac);

    struct UserInfo
    {
        uint64 id;
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
        uint64 id;
        uint64 userId;
        string title;
        string description;
        string[] allowedUrls;
    }

    uint64 public applicationId = 1;
    uint64 public userId = 1;

    mapping(bytes32 => UserInfo) public Users;
    mapping(address => InviteInfo) public Invites;
    mapping(bytes32 => UserWallet[]) public UserWallets;
    mapping(uint64 => Application) public Applications;
    mapping(address => uint64) public UsersIds;

    modifier userRegistered {
        require(
            isAddressRegistered(msg.sender),
            "Only registered user can call this function"
        );
        _;
    }

    modifier userInvited {
        require(
            msg.sender == owner,
            "Only invited user can call this function"
        );
        _;
    }

    constructor() public {
        bytes32 username = keccak256('admin');
        _createUser(username);
        uint64 id = getUserIdByAddress(msg.sender);
        _createApplication(id, 'GetLogin', 'GetLogin - auth app');
        _addApplicationUrl(id, 'https://localhost:3001');
    }

    /* Private methods */
    function _createUser(bytes32 usernameHash) private {
       Users[usernameHash] = UserInfo({id: userId, username: usernameHash, isActive: true});
       UsersIds[msg.sender] = userId;
       addWallet(usernameHash, msg.sender);
       userId++;
    }

    function _createApplication(uint64 ownerUserId, string memory title, string memory description) private {
        string[] memory allowedUrls;
        Applications[applicationId] = Application({id: applicationId, userId: ownerUserId, title: title, description: description, allowedUrls: allowedUrls});
        applicationId++;
    }

    function _addApplicationUrl(uint64 appId, string memory url) private {
        Applications[appId].allowedUrls.push(url);
    }

    function _deleteApplicationUrl(uint64 appId, uint index) private {
        delete Applications[appId].allowedUrls[index];
    }

    /* End of private methods */

    /* Public methods with userRegistered modifier */
    function createInvite(address payable inviteAddress, bytes32 creatorUsername) public payable userRegistered {
        // todo check is invite creator registered
        Invites[inviteAddress] = InviteInfo({inviteAddress: inviteAddress, creatorUsername: creatorUsername, isActive: true});
    }

    function createApplication(string memory title, string memory description) public userRegistered {
        uint64 currentUserId = getUserIdByAddress(msg.sender);
        _createApplication(currentUserId, title, description);
    }

    function addApplicationUrl(uint64 appId, string memory url) public userRegistered {
        // todo check is owner
        _addApplicationUrl(appId, url);
    }

    function deleteApplicationUrl(uint64 appId, uint index) public userRegistered {
        // todo check is owner
        _deleteApplicationUrl(appId, index);
    }

    function createUser(bytes32 usernameHash) public payable userRegistered {
        // todo check is usernameHash not exists
       _createUser(usernameHash);
    }

    function createUserFromInvite(bytes32 usernameHash, address walletAddress, string memory ciphertext, string memory iv, string memory salt, string memory mac) public payable userRegistered {
       // todo check is sender can register
       // todo disable sender for reg
       createUser(usernameHash);
       emit EventStoreWallet(usernameHash, walletAddress, ciphertext, iv, salt, mac);
    }

    function addWallet(bytes32 usernameHash, address wallet) public payable userRegistered {
        // todo check is username assigned with sender
        // todo check is wallet already exists
        UserWallets[usernameHash].push(UserWallet({username: usernameHash, wallet: wallet}));
    }

    /* End of public methods with userRegistered modifier */

    /* View methods */
    function getUserInfo(bytes32 usernameHash) public view returns (UserInfo memory) {
        return Users[usernameHash];
    }

    function isAddressRegistered(address wallet) public view returns (bool) {
        return getUserIdByAddress(wallet) > 0;
    }

    function getUserIdByAddress(address wallet) public view returns (uint64) {
        uint64 currentUserId = UsersIds[wallet];
        require(
            currentUserId > 0,
            "User with this address not found"
        );
        return currentUserId;
    }

    /* End of view methods */
}
