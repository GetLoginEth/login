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

    uint8 sessionMain = 1;
    uint8 sessionApp = 2;

    struct Username
    {
        bool isActive;
        bytes32 username;
    }

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

    struct UserSession
    {
        bytes32 username;
        address wallet;
        uint8 sessionType;
    }

    struct Application
    {
        uint64 id;
        bytes32 usernameHash;
        string title;
        string description;
        string[] allowedUrls;
    }

    uint64 public applicationId = 1;

    mapping(bytes32 => UserInfo) public Users;
    mapping(address => Username) public UsersAddressUsername;
    mapping(bytes32 => UserSession[]) public UserSessions;
    mapping(address => InviteInfo) public Invites;
    mapping(uint64 => Application) public Applications;

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
        uint64 newAppId = _createApplication(username, 'GetLogin', 'GetLogin - auth app');
        _addApplicationUrl(newAppId, 'https://localhost:3001');
    }

    /* Private methods */
    function _createUser(bytes32 usernameHash) private {
        // todo emit event
        require(
            isUsernameExists(usernameHash) == false,
            "Username already used");
        require(
            isAddressRegistered(msg.sender) == false,
            "Wallet already used");
        Users[usernameHash] = UserInfo({username: usernameHash, isActive: true});
        UsersAddressUsername[msg.sender] = Username({username: usernameHash, isActive: true});
        addSession(msg.sender, sessionMain);
    }

    function _createApplication(bytes32 usernameHash, string memory title, string memory description) private returns (uint64) {
        // todo emit event?
        string[] memory allowedUrls;
        Applications[applicationId] = Application({id: applicationId, usernameHash: usernameHash, title: title, description: description, allowedUrls: allowedUrls});
        applicationId++;

        return applicationId;
    }

    function _addApplicationUrl(uint64 appId, string memory url) private {
        // todo emit event?
        Applications[appId].allowedUrls.push(url);
    }

    function _deleteApplicationUrl(uint64 appId, uint index) private {
        // todo emit event?
        delete Applications[appId].allowedUrls[index];
    }

    /* End of private methods */

    /* Public methods with userRegistered modifier */
    function createApplication(string memory title, string memory description) public userRegistered {
        bytes32 usernameHash = getUsernameByAddress(msg.sender);
        _createApplication(usernameHash, title, description);
    }

    function addApplicationUrl(uint64 appId, string memory url) public userRegistered {
        // todo check is owner
        _addApplicationUrl(appId, url);
    }

    function deleteApplicationUrl(uint64 appId, uint index) public userRegistered {
        // todo check is owner
        _deleteApplicationUrl(appId, index);
    }

    function createUser(bytes32 usernameHash) public payable {
       _createUser(usernameHash);
    }

    function createInvite(address payable inviteAddress, bytes32 creatorUsername) public payable userRegistered {
        // todo emit event?
        Invites[inviteAddress] = InviteInfo({inviteAddress: inviteAddress, creatorUsername: creatorUsername, isActive: true});
    }

    function createUserFromInvite(bytes32 usernameHash, address walletAddress, string memory ciphertext, string memory iv, string memory salt, string memory mac) public payable userRegistered {
       // todo check is sender can register
       // todo disable sender for reg
       createUser(usernameHash);
       emit EventStoreWallet(usernameHash, walletAddress, ciphertext, iv, salt, mac);
    }

    function addSession(address wallet, uint8 sessionType) public payable userRegistered {
        // todo check is username assigned with sender
        // todo check is wallet not already exists
        // todo check is wallet can add new wallets
        bytes32 usernameHash = getUsernameByAddress(wallet);
        UserSessions[usernameHash].push(UserSession({username: usernameHash, wallet: wallet, sessionType: sessionType}));
    }

    /* End of public methods with userRegistered modifier */

    /* View methods */
    function getUserInfo(bytes32 usernameHash) public view returns (UserInfo memory) {
        return Users[usernameHash];
    }

    function isUsernameExists(bytes32 usernameHash) public view returns (bool) {
        return getUserInfo(usernameHash).isActive == true;
    }

    function isAddressRegistered(address wallet) public view returns (bool) {
        return getUserByAddress(wallet).isActive == true;
    }

    function isAppOwner(uint64 appIp, address checkAddress) public view returns (bool) {
        // todo implemennt
        //return getUserByAddress(wallet).isActive == true;
    }

    function getUserByAddress(address wallet) public view returns (UserInfo memory) {
        Username memory currentUser = UsersAddressUsername[wallet];
        require(
            currentUser.isActive == true,
            "User with this address not found"
        );
        return Users[currentUser.username];
    }

    function getUsernameByAddress(address wallet) public view returns (bytes32) {
        return getUserByAddress(wallet).username;
    }

    /* End of view methods */
}
