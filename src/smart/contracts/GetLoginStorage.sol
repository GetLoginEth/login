// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

contract GetLoginStorage {
    address public owner;
    address public logicAddress;
    uint256 public users;
    uint256 public invites;

    constructor () {
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

    // store encrypted wallet assigned to user
    event EventStoreWallet(bytes32 indexed username, address indexed walletAddress, string ciphertext, string iv, string salt, string mac);
    // store just address that assigned to user (in case Metamask and etc)
    event EventStoreWallet(bytes32 indexed username, address indexed walletAddress);
    // event created with inviteAddress
    event EventInviteCreated(bytes32 indexed creatorUsername, address inviteAddress);
    // store encrypted app session
    event EventAppSession(uint64 indexed appId, bytes32 indexed username, string iv, string ephemPublicKey, string ciphertext, string mac);
    // store just address that assigned to session and stored somewhere else
    event EventAppSession(uint64 indexed appId, bytes32 indexed username, address sessionAddress);
    // new dev app created
    event EventAppCreated(bytes32 indexed creatorUsername, uint64 indexed appId);
    // user created
    event EventUserCreated(bytes32 indexed username);

    struct Username
    {
        bool isActive;
        // todo define a uniform variable name
        bytes32 username;
        uint64 appId;
    }

    struct UserInfo
    {
        // todo define a uniform variable name
        bytes32 username;
        address mainAddress;
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

    struct AppSession
    {
        // todo define a uniform variable name
        bytes32 username;
        address wallet;
        uint64 appId;
        bool isActive;
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
    mapping(bytes32 => string) public UsersSettings;
    mapping(address => Username) public UsersAddressUsername;
    mapping(bytes32 => mapping(uint64 => AppSession[])) public AppSessions;
    mapping(bytes32 => uint64[]) public AppSessionIndex;
    mapping(address => InviteInfo) public Invites;
    mapping(uint64 => Application) public Applications;

    function setLogicAddress(address _address) onlyOwner public {
        logicAddress = _address;
    }

    function emitEventStoreWallet(bytes32 _username, address _walletAddress, string memory _ciphertext, string memory _iv, string memory _salt, string memory _mac) onlyLogicAddress public {
        emit EventStoreWallet(_username, _walletAddress, _ciphertext, _iv, _salt, _mac);
    }

    function emitEventStoreWallet(bytes32 _username, address _walletAddress) onlyLogicAddress public {
        emit EventStoreWallet(_username, _walletAddress);
    }

    function emitEventInviteCreated(bytes32 _creatorUsername, address _inviteAddress) onlyLogicAddress public {
        emit EventInviteCreated(_creatorUsername, _inviteAddress);
    }

    function emitEventAppSession(uint64 _appId, bytes32 _username, string memory _iv, string memory _ephemPublicKey, string memory _ciphertext, string memory _mac) onlyLogicAddress public {
        emit EventAppSession(_appId, _username, _iv, _ephemPublicKey, _ciphertext, _mac);
    }

    function emitEventSimpleAppSession(uint64 _appId, bytes32 _username, address _sessionAddress) onlyLogicAddress public {
        emit EventAppSession(_appId, _username, _sessionAddress);
    }

    function emitEventAppCreated(bytes32 _creatorUsername, uint64 _appId) onlyLogicAddress public {
        emit EventAppCreated(_creatorUsername, _appId);
    }

    function emitEventUserCreated(bytes32 _username) onlyLogicAddress public {
        emit EventUserCreated(_username);
    }

    function getUser(bytes32 _usernameHash) public view returns (UserInfo memory) {
        return Users[_usernameHash];
    }

    function setUser(bytes32 _usernameHash, UserInfo memory _info) onlyLogicAddress public {
        Users[_usernameHash] = _info;
    }

    function getSettings(bytes32 _key) public view returns (string memory) {
        return UsersSettings[_key];
    }

    function setSettings(bytes32 _key, string memory _value) onlyLogicAddress public {
        UsersSettings[_key] = _value;
    }

    function getUsersAddressUsername(address _address) public view returns (Username memory) {
        return UsersAddressUsername[_address];
    }

    function setUsersAddressUsername(address _address, Username memory _info) onlyLogicAddress public {
        UsersAddressUsername[_address] = _info;
    }

    function getApplication(uint64 _id) public view returns (Application memory) {
        return Applications[_id];
    }

    function setApplication(uint64 _id, Application memory _data) onlyLogicAddress public {
        Applications[_id] = _data;
    }

    function incrementApplicationId() onlyLogicAddress public {
        applicationId++;
    }

    function incrementUsers() onlyLogicAddress public {
        users++;
    }

    function incrementInvites() onlyLogicAddress public {
        invites++;
    }

    function pushApplicationUrl(uint64 _id, string memory _url) onlyLogicAddress public {
        Applications[_id].allowedUrls.push(_url);
    }

    function pushApplicationContract(uint64 _id, address _wallet) onlyLogicAddress public {
        Applications[_id].allowedContracts.push(_wallet);
    }

    function deleteApplicationUrl(uint64 _id, uint _index) onlyLogicAddress public {
        delete Applications[_id].allowedUrls[_index];
    }

    function deleteApplicationContract(uint64 _id, uint _index) onlyLogicAddress public {
        delete Applications[_id].allowedContracts[_index];
    }

    function pushAppSession(uint64 _appId, bytes32 _usernameHash, address _wallet) onlyLogicAddress public {
        AppSessions[_usernameHash][_appId].push(AppSession({username : _usernameHash, wallet : _wallet, appId : _appId, isActive : true}));
    }

    function getInvite(address _address) public view returns (InviteInfo memory) {
        return Invites[_address];
    }

    function setInvite(address _address, InviteInfo memory _data) onlyLogicAddress public {
        Invites[_address] = _data;
    }

    function getAppSessions(uint64 _appId, bytes32 _usernameHash) public view returns (AppSession[] memory) {
        return AppSessions[_usernameHash][_appId];
    }

    function setAppSession(uint64 _appId, bytes32 _usernameHash, uint _index, AppSession memory _appSession) onlyLogicAddress public {
        AppSessions[_usernameHash][_appId][_index] = _appSession;
    }

    function getAppSessionIndex(bytes32 _usernameHash) public view returns (uint64[] memory) {
        return AppSessionIndex[_usernameHash];
    }

    function pushAppSessionIndex(bytes32 _usernameHash, uint64 _appId) onlyLogicAddress public {
        AppSessionIndex[_usernameHash].push(_appId);
    }
}
