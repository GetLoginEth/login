pragma solidity ^0.6.1;
pragma experimental ABIEncoderV2;

contract GetLoginStorage {
    address owner;
    address logicAddress;

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

    event EventStoreWallet(bytes32 indexed username, address indexed walletAddress, string ciphertext, string iv, string salt, string mac);
    event EventInviteCreated(bytes32 indexed creatorUsername, address inviteAddress);
    event EventAppSession(uint64 indexed appId, bytes32 indexed username, string iv, string ephemPublicKey, string ciphertext, string mac);
    event EventAppCreated(bytes32 indexed creatorUsername, uint64 indexed appId);

    uint8 sessionMain = 1;
    uint8 sessionApp = 2;

    struct Username
    {
        bool isActive;
        // todo define a uniform variable name
        bytes32 username;
    }

    struct UserInfo
    {
        // todo define a uniform variable name
        bytes32 username;
        bool isActive;
    }

    struct InviteInfo
    {
        address inviteAddress;
        // todo define a uniform variable name
        bytes32 creatorUsername;
        bytes32 registeredUsername;
        bool isActive;
    }

    struct UserSession
    {
        // todo define a uniform variable name
        bytes32 username;
        address wallet;
        uint8 sessionType;
        uint64 appId;
    }

    struct Application
    {
        uint64 id;
        // todo define a uniform variable name (usernameHash or username)
        bytes32 usernameHash;
        string title;
        string description;
        string[] allowedUrls;
        address[] allowedContracts;
        bool isActive;
    }

    uint64 public applicationId = 1;

    mapping(bytes32 => UserInfo) public Users;
    mapping(address => Username) public UsersAddressUsername;
    mapping(bytes32 => UserSession[]) public UserSessions;
    mapping(address => InviteInfo) public Invites;
    mapping(uint64 => Application) public Applications;

    function setLogicAddress(address _address) onlyOwner public {
        logicAddress = _address;
    }

    function emitEventStoreWallet(bytes32 username, address walletAddress, string memory ciphertext, string memory iv, string memory salt, string memory mac) onlyLogicAddress public {
        emit EventStoreWallet(username, walletAddress, ciphertext, iv, salt, mac);
    }

    function emitEventInviteCreated(bytes32 creatorUsername, address inviteAddress) onlyLogicAddress public {
        emit EventInviteCreated(creatorUsername, inviteAddress);
    }

    function emitEventAppSession(uint64 appId, bytes32 username, string memory iv, string memory ephemPublicKey, string memory ciphertext, string memory mac) onlyLogicAddress public {
        emit EventAppSession(appId, username, iv, ephemPublicKey, ciphertext, mac);
    }

    function emitEventAppCreated(bytes32 creatorUsername, uint64 appId) onlyLogicAddress public {
        emit EventAppCreated(creatorUsername, appId);
    }

    function getUser(bytes32 usernameHash) public view returns (UserInfo memory){
        return Users[usernameHash];
    }

    function setUser(bytes32 usernameHash, UserInfo memory info) onlyLogicAddress public {
        Users[usernameHash] = info;
    }

    function getUsersAddressUsername(address _address) public view returns (Username memory){
        return UsersAddressUsername[_address];
    }

    function setUsersAddressUsername(address _address, Username memory info) onlyLogicAddress public {
        UsersAddressUsername[_address] = info;
    }
}
