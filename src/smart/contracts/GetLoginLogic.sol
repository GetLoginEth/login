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
        getLoginStorage.setUsersAddressUsername(_ownerWallet, GetLoginStorage.Username({username : _usernameHash, isActive : true, appId : 0}));
        getLoginStorage.emitEventUserCreated(_usernameHash);
        getLoginStorage.incrementUsers();
    }

    function _changeUserOwner(address _oldAddress, address _newAddress) private {
        validateMainAddress(_oldAddress);
        validateAddressAvailable(_newAddress);

        GetLoginStorage.UserInfo memory user = getUserByAddress(_oldAddress);
        bytes32 usernameHash = user.username;
        // deactivate old main address
        getLoginStorage.setUsersAddressUsername(_oldAddress, GetLoginStorage.Username({username : usernameHash, isActive : false, appId : 0}));
        // activate new address
        getLoginStorage.setUsersAddressUsername(_newAddress, GetLoginStorage.Username({username : usernameHash, isActive : true, appId : 0}));
        // set new main address and store changed user info
        user.mainAddress = _newAddress;
        getLoginStorage.setUser(usernameHash, user);
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

    function _pushAppSession(uint64 _appId, bytes32 _usernameHash, address _wallet) private {
        GetLoginStorage.AppSession[] memory sessions = getAppSessions(_appId, _usernameHash);
        uint64[] memory sessionIndex = getLoginStorage.getAppSessionIndex(_usernameHash);
        if (sessions.length > 0) {
            uint index = sessions.length - 1;
            GetLoginStorage.AppSession memory session = sessions[index];
            session.isActive = false;
            getLoginStorage.setAppSession(_appId, _usernameHash, index, session);
        }

        getLoginStorage.pushAppSession(_appId, _usernameHash, _wallet);

        // push to session index only once
        bool sessionIndexExists = false;
        for (uint i = 0; i < sessionIndex.length; i++) {
            if (sessionIndex[i] == _appId) {
                sessionIndexExists = true;
                break;
            }
        }

        if (sessionIndexExists == false) {
            getLoginStorage.pushAppSessionIndex(_usernameHash, _appId);
        }
    }

    function _setUserSettings(bytes32 _usernameHash, string memory _key, string memory _value) private {
        bytes32 keyHash = keccak256(abi.encode(_usernameHash, "_", _key));
        getLoginStorage.setSettings(keyHash, _value);
    }

    function _setGlobalSettings(string memory _key, string memory _value) private {
        bytes32 keyHash = keccak256(abi.encode("global_", _key));
        getLoginStorage.setSettings(keyHash, _value);
    }

    function _createAppSession(uint64 _appId, address _senderAddress, address _sessionAddress) private {
        validateMainAddress(_senderAddress);
        validateAppExists(_appId);
        validateAddressAvailable(_sessionAddress);

        bytes32 usernameHash = getUsernameByAddress(_senderAddress);
        // add new address to the global scope
        getLoginStorage.setUsersAddressUsername(_sessionAddress, GetLoginStorage.Username({isActive : true, username : usernameHash, appId : _appId}));

        _pushAppSession(_appId, usernameHash, _sessionAddress);
    }

    /* End of private methods */

    /* Validators */
    function validateAppOwner(uint64 _appId, address _wallet) public view {
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
        validateAddressAvailable(_walletAddress);

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
        _createAppSession(_appId, msg.sender, _sessionAddress);
        if (msg.value > 0) {
            _sessionAddress.transfer(msg.value);
        }

        bytes32 usernameHash = getUsernameByAddress(msg.sender);
        getLoginStorage.emitEventAppSession(_appId, usernameHash, _iv, _ephemPublicKey, _ciphertext, _mac);
    }

    function createSimpleAppSession(uint64 _appId, address payable _sessionAddress) public payable {
        _createAppSession(_appId, msg.sender, _sessionAddress);
        if (msg.value > 0) {
            _sessionAddress.transfer(msg.value);
        }

        bytes32 usernameHash = getUsernameByAddress(msg.sender);
        getLoginStorage.emitEventSimpleAppSession(_appId, usernameHash, _sessionAddress);
    }

    function closeAppSession(uint64 _appId) public {
        validateMainAddress(msg.sender);

        bytes32 usernameHash = getUsernameByAddress(msg.sender);
        GetLoginStorage.AppSession[] memory sessions = getAppSessions(_appId, usernameHash);
        if (sessions.length > 0) {
            uint index = sessions.length - 1;
            GetLoginStorage.AppSession memory session = sessions[index];
            if (session.isActive) {
                session.isActive = false;
                getLoginStorage.setAppSession(_appId, usernameHash, index, session);
            }
        }
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

        return currentUser.isActive;
    }

    function isAppOwner(uint64 _appId, address _checkAddress) public view returns (bool) {
        validateMainAddress(_checkAddress);

        bytes32 currentUsernameHash = getUsernameByAddress(_checkAddress);
        return getLoginStorage.getApplication(_appId).usernameHash == currentUsernameHash;
    }

    function getUserByAddress(address _address) public view returns (GetLoginStorage.UserInfo memory) {
        GetLoginStorage.Username memory currentUser = getLoginStorage.getUsersAddressUsername(_address);
        if (currentUser.appId > 0) {
            GetLoginStorage.AppSession[] memory sessions = getAppSessions(currentUser.appId, currentUser.username);
            require(sessions.length > 0, "Sessions should not be empty");
            GetLoginStorage.AppSession memory session = sessions[sessions.length - 1];
            require(session.wallet == _address, "Session address should be the same");
            require(session.isActive, "User session address is not active");
        }

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

    function getAppSessions(uint64 _appId, bytes32 _usernameHash) public view returns (GetLoginStorage.AppSession[] memory) {
        return getLoginStorage.getAppSessions(_appId, _usernameHash);
    }

    function getActiveAppSessions(bytes32 _usernameHash) public view returns (GetLoginStorage.AppSession[] memory) {
        uint64[] memory sessionIndex = getLoginStorage.getAppSessionIndex(_usernameHash);
        GetLoginStorage.AppSession[] memory result = new GetLoginStorage.AppSession[](sessionIndex.length);

        for (uint i = 0; i < sessionIndex.length; i++) {
            uint64 appId = sessionIndex[i];
            GetLoginStorage.AppSession[] memory sessions = getAppSessions(appId, _usernameHash);
            if (sessions.length > 0) {
                GetLoginStorage.AppSession memory session = sessions[sessions.length - 1];
                if (session.isActive) {
                    result[i] = session;
                }
            }
        }

        return result;
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
