// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import './GetLoginStorage.sol';

contract GetLoginLogic {
    GetLoginStorage public getLoginStorage;
    address public owner;

    // user settings
    string settingsInviteReset = "invite_reset";
    // global settings
    string settingsInvitesOnly = "invites_only";

    struct SessionData
    {
        uint64 appId;
        string iv;
        string ephemPublicKey;
        string ciphertext;
        string mac;
    }

    struct SettingsData
    {
        string inviteReset;
    }

    uint8 SESSION_MAIN = 1;
    uint8 SESSION_APP = 2;

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    function setOwner(address _address) onlyOwner public {
        owner = _address;
    }

    function setStorageAddress(GetLoginStorage _address) onlyOwner public {
        getLoginStorage = _address;
    }

    constructor(GetLoginStorage _getLoginStorage) {
        owner = msg.sender;
        getLoginStorage = _getLoginStorage;
    }

    function init() onlyOwner public {
        bytes32 usernameHash = keccak256('admin');
        GetLoginStorage.UserInfo memory info = getLoginStorage.getUser(usernameHash);
        if (info.isActive != true) {
            _createUser(usernameHash, msg.sender);
            string[] memory allowedUrls;
            address[] memory allowedContracts;
            uint64 newAppId = _createApplication(usernameHash, 'GetLogin', 'GetLogin - auth app', allowedUrls, allowedContracts);
            _addApplicationUrl(newAppId, 'https://getlogin.org/');
            _addApplicationContract(newAppId, 0x9A0CDE760277DC3A4B2aC6E9D333Af45148eBb60);

            _setGlobalSettings(settingsInvitesOnly, "false");
        }
    }

    /* Private methods */
    function _createUser(bytes32 _usernameHash, address _ownerWallet) private {
        require(isUsernameExists(_usernameHash) == false, "Username already used");
        require(isAddressRegistered(_ownerWallet) == false, "Wallet already used");

        getLoginStorage.setUser(_usernameHash, GetLoginStorage.UserInfo({username : _usernameHash, isActive : true, mainAddress : _ownerWallet}));
        getLoginStorage.setUsersAddressUsername(_ownerWallet, GetLoginStorage.Username({username : _usernameHash, isActive : true}));
        getLoginStorage.emitEventUserCreated(_usernameHash);
        getLoginStorage.incrementUsers();
        _addSessionInit(_usernameHash, _ownerWallet, SESSION_MAIN, 0);
    }

    function _changeUserOwner(address _oldAddress, address _newAddress) private {
        validateMainAddress(_oldAddress);
        validateAddressAvailable(_newAddress);

        GetLoginStorage.UserInfo memory user = getUserByAddress(_oldAddress);
        bytes32 usernameHash = user.username;
        // deactivate old main address
        getLoginStorage.setUsersAddressUsername(_oldAddress, GetLoginStorage.Username({username : usernameHash, isActive : false}));
        // activate new address
        getLoginStorage.setUsersAddressUsername(_newAddress, GetLoginStorage.Username({username : usernameHash, isActive : true}));
        // set new main address and store changed user info
        user.mainAddress = _newAddress;
        getLoginStorage.setUser(usernameHash, user);
        // add change to the history todo: why?
        _addSessionInit(usernameHash, _newAddress, SESSION_MAIN, 0);
    }

    function _createApplication(bytes32 _usernameHash, string memory _title, string memory _description, string[] memory _allowedUrls, address[] memory _allowedContracts) private returns (uint64) {
        uint64 appId = getLoginStorage.applicationId();
        getLoginStorage.setApplication(appId, GetLoginStorage.Application({id : appId, usernameHash : _usernameHash, title : _title, description : _description, allowedUrls : _allowedUrls, allowedContracts : _allowedContracts, isActive : true}));
        getLoginStorage.incrementApplicationId();
        getLoginStorage.emitEventAppCreated(_usernameHash, appId);

        return appId;
    }

    function _addApplicationUrl(uint64 _appId, string memory _url) private {
        getLoginStorage.pushApplicationUrl(_appId, _url);
    }

    function _addApplicationContract(uint64 _appId, address _wallet) private {
        getLoginStorage.pushApplicationContract(_appId, _wallet);
    }

    function _deleteApplicationUrl(uint64 _appId, uint _index) private {
        getLoginStorage.deleteApplicationUrl(_appId, _index);
    }

    function _deleteApplicationContract(uint64 _appId, uint _index) private {
        getLoginStorage.deleteApplicationContract(_appId, _index);
    }

    function _setApplicationActive(uint64 _appId, bool _isActive) private {
        GetLoginStorage.Application memory app = getLoginStorage.getApplication(_appId);
        app.isActive = _isActive;
        getLoginStorage.setApplication(_appId, app);
    }

    function _addSessionInit(bytes32 _usernameHash, address _wallet, uint8 _sessionType, uint64 _appId) private {
        getLoginStorage.pushUserSession(_usernameHash, _wallet, _sessionType, _appId);
    }

    //    function _addSession(address _wallet, uint8 _sessionType, uint64 _appId) private {
    //        validateAppExists(_appId);
    //        validateAddressRegistered(_wallet);
    //        bytes32 usernameHash = getUsernameByAddress(_wallet);
    //        getLoginStorage.pushUserSession(usernameHash, _wallet, _sessionType, _appId);
    //    }

    function _setUserSettings(bytes32 _usernameHash, string memory _key, string memory _value) private {
        bytes32 keyHash = keccak256(abi.encode(_usernameHash, "_", _key));
        getLoginStorage.setSettings(keyHash, _value);
    }

    function _setGlobalSettings(string memory _key, string memory _value) private {
        bytes32 keyHash = keccak256(abi.encode("global_", _key));
        getLoginStorage.setSettings(keyHash, _value);
    }

    /* End of private methods */

    /* Validators */
    function validateAppOwner(uint64 _appId, address _wallet) public view {
        validateMainAddress(_wallet);

        require(isAppOwner(_appId, _wallet), "You do not have access to this application");
    }

    function validateAppExists(uint64 _appId) public view {
        GetLoginStorage.Application memory app = getLoginStorage.getApplication(_appId);
        require(app.isActive, "App not found");
    }

    function validateInviteActive(address _address) public view {
        require(isActiveInvite(_address), "Invite not active");
    }

    function validateAddressRegistered(address _address) public view {
        require(isAddressRegistered(_address), "Address not registered");
    }

    function validateMainAddress(address _address) public view {
        validateAddressRegistered(_address);
        GetLoginStorage.Username memory usernameInfo = getLoginStorage.getUsersAddressUsername(_address);
        GetLoginStorage.UserInfo memory user = getLoginStorage.getUser(usernameInfo.username);
        require(user.mainAddress == _address, "Wallet is not main address");
    }

    function validateAddressAvailable(address _address) public view {
        require(isAddressRegistered(_address) == false, "Address already registered");
    }

    function validateInviteAvailable(address _address) public view {
        require(isInviteAddressUsed(_address) == false, "This address already used for invite");
    }
    /* End validators */

    /* Public methods */
    function createApplication(string memory _title, string memory _description, string[] memory _allowedUrls, address[] memory _allowedContracts) public returns (uint64) {
        validateMainAddress(msg.sender);

        bytes32 usernameHash = getUsernameByAddress(msg.sender);

        return _createApplication(usernameHash, _title, _description, _allowedUrls, _allowedContracts);
    }

    function editApplication(uint64 _appId, string memory _title, string memory _description, string[] memory _allowedUrls, address[] memory _allowedContracts) public {
        validateAppExists(_appId);
        validateAppOwner(_appId, msg.sender);

        GetLoginStorage.Application memory app = getLoginStorage.getApplication(_appId);
        app.title = _title;
        app.description = _description;
        app.allowedUrls = _allowedUrls;
        app.allowedContracts = _allowedContracts;
        getLoginStorage.setApplication(_appId, app);
    }

    function addApplicationUrl(uint64 _appId, string memory _url) public {
        validateAppExists(_appId);
        validateAppOwner(_appId, msg.sender);

        _addApplicationUrl(_appId, _url);
    }

    function addApplicationContract(uint64 _appId, address _address) public {
        validateAppExists(_appId);
        validateAppOwner(_appId, msg.sender);

        _addApplicationContract(_appId, _address);
    }

    function deleteApplicationUrl(uint64 _appId, uint _index) public {
        validateAppExists(_appId);
        validateAppOwner(_appId, msg.sender);

        _deleteApplicationUrl(_appId, _index);
    }

    function deleteApplicationContract(uint64 _appId, uint _index) public {
        validateAppExists(_appId);
        validateAppOwner(_appId, msg.sender);

        _deleteApplicationContract(_appId, _index);
    }

    function deleteApplication(uint64 _appId) public {
        validateAppExists(_appId);
        validateAppOwner(_appId, msg.sender);

        _setApplicationActive(_appId, false);
    }

    function restoreApplication(uint64 _appId) public {
        validateAppOwner(_appId, msg.sender);

        _setApplicationActive(_appId, true);
    }

    /**
        Create user without invite (if enabled by contract owner)
        It allows to signup with Metamask and similar systems
    **/
    function createUser(bytes32 _usernameHash) public payable {
        require(keccak256(abi.encode(getGlobalSettings(settingsInvitesOnly))) == keccak256(abi.encode("false")), "Not allowed to signup without invite");

        _createUser(_usernameHash, msg.sender);
    }

    /**
        Change main wallet for user which assigned to sender
    **/
    function changeUserOwner(address payable _newOwner) public payable {
        _changeUserOwner(msg.sender, _newOwner);
        if (msg.value > 0) {
            _newOwner.transfer(msg.value);
        }

        bytes32 usernameHash = getUsernameByAddress(msg.sender);
        getLoginStorage.emitEventStoreWallet(usernameHash, _newOwner);
    }

    // todo how to use sessions with these users? store not in chain, but in swarm? Do we have
    // deps on side storing?
    // todo implement session creation without wallet in the blockchain
    // todo check every method with correct and incorrect behaviour
    // todo validate events creation

    function createInvite(address payable[] memory _invites) public payable {
        validateMainAddress(msg.sender);

        for (uint i = 0; i < _invites.length; i++) {
            validateInviteAvailable(_invites[i]);
        }

        bytes32 creatorUsernameHash = getUsernameByAddress(msg.sender);
        uint256 val = 0;
        if (msg.value > 0 && _invites.length > 0) {
            val = msg.value / _invites.length;
        }

        for (uint i = 0; i < _invites.length; i++) {
            address payable inviteAddress = _invites[i];
            getLoginStorage.setInvite(inviteAddress, GetLoginStorage.InviteInfo({inviteAddress : inviteAddress, creatorUsername : creatorUsernameHash, registeredUsername : '', isActive : true}));
            if (val > 0) {
                inviteAddress.transfer(val);
            }

            getLoginStorage.emitEventInviteCreated(creatorUsernameHash, inviteAddress);
            getLoginStorage.incrementInvites();
        }
    }

    function createUserFromInvite(bytes32 _usernameHash, address payable _walletAddress, string memory _ciphertext, string memory _iv, string memory _salt, string memory _mac, bool _allowReset) public payable {
        validateInviteActive(msg.sender);
        require(isAddressRegistered(_walletAddress) == false, "Address already registered");

        GetLoginStorage.InviteInfo memory invite = getLoginStorage.getInvite(msg.sender);
        _createUser(_usernameHash, _walletAddress);
        invite.isActive = false;
        invite.registeredUsername = _usernameHash;
        getLoginStorage.setInvite(msg.sender, invite);
        if (msg.value > 0) {
            _walletAddress.transfer(msg.value);
        }

        _setUserSettings(_usernameHash, settingsInviteReset, _allowReset ? "true" : "false");
        getLoginStorage.emitEventStoreWallet(_usernameHash, _walletAddress, _ciphertext, _iv, _salt, _mac);
    }

    function changePassword(address payable _newAddress, string memory _ciphertext, string memory _iv, string memory _salt, string memory _mac, SessionData[] memory _sessions) public payable {
        validateMainAddress(msg.sender);
        validateAddressAvailable(_newAddress);

        bytes32 usernameHash = getUsernameByAddress(msg.sender);
        _changeUserOwner(msg.sender, _newAddress);
        // move all received funds to the new address
        if (msg.value > 0) {
            _newAddress.transfer(msg.value);
        }

        getLoginStorage.emitEventStoreWallet(usernameHash, _newAddress, _ciphertext, _iv, _salt, _mac);
        // replace all sessions with re-encoded ones
        for (uint i = 0; i < _sessions.length; i++) {
            SessionData memory session = _sessions[i];
            getLoginStorage.emitEventAppSession(session.appId, usernameHash, session.iv, session.ephemPublicKey, session.ciphertext, session.mac);
        }
    }

    /**
        Assign new address for old username that created with invite address which call this method
    **/
    function resetPassword(address payable _newAddress, string memory _ciphertext, string memory _iv, string memory _salt, string memory _mac) public payable {
        GetLoginStorage.InviteInfo memory invite = getLoginStorage.getInvite(msg.sender);
        require(invite.isActive == false, "Only inactive invite can reset password");
        require(invite.registeredUsername != "", "Only invite with username can reset password");
        require(keccak256(abi.encode(getInviteReset(invite.registeredUsername))) == keccak256(abi.encode("true")), "Settings not allow reset password");

        GetLoginStorage.UserInfo memory user = getLoginStorage.getUser(invite.registeredUsername);
        _changeUserOwner(user.mainAddress, _newAddress);

        // transfer all received funds
        if (msg.value > 0) {
            _newAddress.transfer(msg.value);
        }

        getLoginStorage.emitEventStoreWallet(invite.registeredUsername, _newAddress, _ciphertext, _iv, _salt, _mac);
    }

    function createAppSession(uint64 _appId, address payable _sessionAddress, string memory _iv, string memory _ephemPublicKey, string memory _ciphertext, string memory _mac) public payable {
        validateMainAddress(msg.sender);
        validateAppExists(_appId);

        bytes32 usernameHash = getUsernameByAddress(msg.sender);
        // todo on close set active to false (when created new over old)
        getLoginStorage.setUsersAddressUsername(_sessionAddress, GetLoginStorage.Username({isActive : true, username : usernameHash}));
        if (msg.value > 0) {
            _sessionAddress.transfer(msg.value);
        }

        getLoginStorage.emitEventAppSession(_appId, usernameHash, _iv, _ephemPublicKey, _ciphertext, _mac);
    }

    function createSimpleAppSession(uint64 _appId, address payable _sessionAddress) public payable {
        validateMainAddress(msg.sender);
        validateAppExists(_appId);

        bytes32 usernameHash = getUsernameByAddress(msg.sender);
        // todo on close set active to false (when created new over old)
        getLoginStorage.setUsersAddressUsername(_sessionAddress, GetLoginStorage.Username({isActive : true, username : usernameHash}));
        if (msg.value > 0) {
            _sessionAddress.transfer(msg.value);
        }

        getLoginStorage.emitEventSimpleAppSession(_appId, usernameHash, _sessionAddress);
    }

    function setInviteReset(string memory _value) public {
        validateMainAddress(msg.sender);

        bytes32 usernameHash = getUsernameByAddress(msg.sender);
        _setUserSettings(usernameHash, settingsInviteReset, _value);
    }

    function setGlobalOnlyInvites(string memory value) onlyOwner public {
        _setGlobalSettings(settingsInvitesOnly, value);
    }

    /* End of public methods */

    /* View methods */
    function getApplication(uint64 _id) public view returns (GetLoginStorage.Application memory) {
        validateAppExists(_id);

        return getLoginStorage.getApplication(_id);
    }

    function getUserInfo(bytes32 _usernameHash) public view returns (GetLoginStorage.UserInfo memory) {
        return getLoginStorage.getUser(_usernameHash);
    }

    function isUsernameExists(bytes32 _usernameHash) public view returns (bool) {
        return getUserInfo(_usernameHash).isActive;
    }

    function isAddressRegistered(address _address) public view returns (bool) {
        GetLoginStorage.Username memory currentUser = getLoginStorage.getUsersAddressUsername(_address);
        if (currentUser.isActive != true) {
            return false;
        }

        GetLoginStorage.UserInfo memory info = getLoginStorage.getUser(currentUser.username);

        return info.isActive;
    }

    function isAppOwner(uint64 _appId, address _checkAddress) public view returns (bool) {
        // todo check that `checkAddress` is mainAddress of user
        // todo remove validation from `validateAppOwner`
        bytes32 currentUsernameHash = getUsernameByAddress(_checkAddress);
        return getLoginStorage.getApplication(_appId).usernameHash == currentUsernameHash;
    }

    function getUserByAddress(address _address) public view returns (GetLoginStorage.UserInfo memory) {
        // todo check that `_wallet` is not expired session address. maybe split getUser.. method to mainwallet/session wallet
        GetLoginStorage.Username memory currentUser = getLoginStorage.getUsersAddressUsername(_address);
        require(currentUser.isActive, "User with this address not found");
        return getLoginStorage.getUser(currentUser.username);
    }

    function getUsernameByAddress(address _address) public view returns (bytes32) {
        return getUserByAddress(_address).username;
    }

    function isActiveInvite(address _address) public view returns (bool) {
        GetLoginStorage.InviteInfo memory info = getLoginStorage.getInvite(_address);
        return info.isActive;
    }

    function isInviteAddressUsed(address _address) public view returns (bool) {
        GetLoginStorage.InviteInfo memory info = getLoginStorage.getInvite(_address);
        return info.creatorUsername != '';
    }

    function getInvite(address _address) public view returns (GetLoginStorage.InviteInfo memory) {
        return getLoginStorage.getInvite(_address);
    }

    function getUserSessions(bytes32 _usernameHash) public view returns (GetLoginStorage.UserSession[] memory) {
        return getLoginStorage.getUserSessions(_usernameHash);
    }

    function getAllSettings(bytes32 _usernameHash) public view returns (SettingsData memory) {
        return SettingsData({inviteReset : getInviteReset(_usernameHash)});
    }

    function getSettings(bytes32 _usernameHash, string memory _key) public view returns (string memory) {
        bytes32 keyHash = keccak256(abi.encode(_usernameHash, "_", _key));
        return getLoginStorage.getSettings(keyHash);
    }

    function getGlobalSettings(string memory _key) public view returns (string memory) {
        bytes32 keyHash = keccak256(abi.encode("global_", _key));
        return getLoginStorage.getSettings(keyHash);
    }

    function getInviteReset(bytes32 _usernameHash) public view returns (string memory) {
        return getSettings(_usernameHash, settingsInviteReset);
    }

    /* End of view methods */
}
