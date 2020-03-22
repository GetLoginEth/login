pragma solidity ^0.6.1;
pragma experimental ABIEncoderV2;

import './GetLoginStorage.sol';

contract GetLoginLogic {
    GetLoginStorage public getLoginStorage;
    address public owner;
    string settingsInviteReset = "invite_reset";

    struct SessionData
    {
        uint64 appId;
        string iv;
        string ephemPublicKey;
        string ciphertext;
        string mac;
    }

    uint8 sessionMain = 1;
    uint8 sessionApp = 2;

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

    constructor(GetLoginStorage _getLoginStorage) public {
        owner = msg.sender;
        getLoginStorage = _getLoginStorage;
    }

    function init() onlyOwner public {
        bytes32 username = keccak256('admin');
        GetLoginStorage.UserInfo memory info = getLoginStorage.getUser(username);
        if (info.isActive != true) {
            _createUser(username, msg.sender);
            string[] memory allowedUrls;
            address[] memory allowedContracts;
            uint64 newAppId = _createApplication(username, 'GetLogin', 'GetLogin - auth app', allowedUrls, allowedContracts);
            _addApplicationUrl(newAppId, 'https://localhost:3001/openid');
            _addApplicationUrl(newAppId, 'https://localhost:3001/');
            _addApplicationContract(newAppId, 0xD66521103Cb882d6afEb051Ae3e986506Af56409);
            _addApplicationContract(newAppId, 0xD66521103Cb882d6afEb051Ae3e986506Af56409);
        }
    }

    /* Private methods */
    function _createUser(bytes32 usernameHash, address ownerWallet) private {
        require(isUsernameExists(usernameHash) == false, "Username already used");
        require(isAddressRegistered(ownerWallet) == false, "Wallet already used");
        //Users[usernameHash] = UserInfo({username : usernameHash, isActive : true});
        getLoginStorage.setUser(usernameHash, GetLoginStorage.UserInfo({username : usernameHash, isActive : true}));
        //UsersAddressUsername[ownerWallet] = Username({username : usernameHash, isActive : true});
        getLoginStorage.setUsersAddressUsername(ownerWallet, GetLoginStorage.Username({username : usernameHash, isActive : true}));
        _addSessionInit(usernameHash, ownerWallet, sessionMain, 0);
    }

    function _createApplication(bytes32 usernameHash, string memory title, string memory description, string[] memory allowedUrls, address[] memory allowedContracts) private returns (uint64) {
        uint64 appId = getLoginStorage.applicationId();
        getLoginStorage.setApplication(appId, GetLoginStorage.Application({id : appId, usernameHash : usernameHash, title : title, description : description, allowedUrls : allowedUrls, allowedContracts : allowedContracts, isActive : true}));
        getLoginStorage.incrementApplicationId();
        getLoginStorage.emitEventAppCreated(usernameHash, appId);

        return appId;
    }

    function _addApplicationUrl(uint64 appId, string memory url) private {
        getLoginStorage.pushApplicationUrl(appId, url);
    }

    function _addApplicationContract(uint64 appId, address wallet) private {
        getLoginStorage.pushApplicationContract(appId, wallet);
    }

    function _deleteApplicationUrl(uint64 appId, uint index) private {
        getLoginStorage.deleteApplicationUrl(appId, index);
    }

    function _deleteApplicationContract(uint64 appId, uint index) private {
        getLoginStorage.deleteApplicationContract(appId, index);
    }

    function _setApplicationActive(uint64 appId, bool isActive) private {
        //Applications[appId].isActive = isActive;
        // todo possibly not work because get and. try direct set
        GetLoginStorage.Application memory app = getLoginStorage.getApplication(appId);
        app.isActive = isActive;
        getLoginStorage.setApplication(appId, app);
    }

    function _addSessionInit(bytes32 usernameHash, address wallet, uint8 sessionType, uint64 appId) private {
        getLoginStorage.pushUserSession(usernameHash, wallet, sessionType, appId);
    }

    function _addSession(address wallet, uint8 sessionType, uint64 appId) private {
        validateAppExists(appId);
        validateAddressRegistered(wallet);
        bytes32 usernameHash = getUsernameByAddress(wallet);
        //UserSessions[usernameHash].push(UserSession({username : usernameHash, wallet : wallet, sessionType : sessionType, appId : appId}));
        getLoginStorage.pushUserSession(usernameHash, wallet, sessionType, appId);
    }

    function _setSettings(address wallet, string memory key, string memory value) private {
        bytes32 usernameHash = getUsernameByAddress(wallet);
        // todo inspect is correct way
        bytes32 keyHash = keccak256(abi.encode(usernameHash, "_", key));
        getLoginStorage.setSettings(keyHash, value);
    }

    /* End of private methods */

    /* Validators */
    function validateAppOwner(uint64 appId, address wallet) public view {
        // todo check is user address is not session
        validateAddressRegistered(wallet);
        require(isAppOwner(appId, wallet), "You do not have access to this application");
    }

    function validateAppExists(uint64 appId) public view {
        GetLoginStorage.Application memory app = getLoginStorage.getApplication(appId);
        require(app.isActive, "App not found");
    }

    function validateInviteActive(address wallet) public view {
        require(isActiveInvite(wallet), "Invite not active");
    }

    function validateAddressRegistered(address wallet) public view {
        require(isAddressRegistered(wallet), "Address not registered");
    }

    function validateAddressAvailable(address wallet) public view {
        require(isAddressRegistered(wallet) == false, "Address already registered");
    }

    function validateInviteAvailable(address wallet) public view {
        //require(isActiveInvite(wallet) == false, "This address already used for invite");
        require(isInviteAddressUsed(wallet) == false, "This address already used for invite");
    }
    /* End validators */

    /* Public methods */
    function createApplication(string memory title, string memory description, string[] memory allowedUrls, address[] memory allowedContracts) public returns (uint64) {
        // todo only main session can create and edit app (check it in top hierarchy method)?
        validateAddressRegistered(msg.sender);
        bytes32 usernameHash = getUsernameByAddress(msg.sender);
        return _createApplication(usernameHash, title, description, allowedUrls, allowedContracts);
    }

    function editApplication(uint64 appId, string memory title, string memory description, string[] memory allowedUrls, address[] memory allowedContracts) public {
        validateAppExists(appId);
        validateAppOwner(appId, msg.sender);
        GetLoginStorage.Application memory app = getLoginStorage.getApplication(appId);
        app.title = title;
        app.description = description;
        app.allowedUrls = allowedUrls;
        app.allowedContracts = allowedContracts;
        getLoginStorage.setApplication(appId, app);
    }

    function addApplicationUrl(uint64 appId, string memory url) public {
        validateAppExists(appId);
        validateAppOwner(appId, msg.sender);
        _addApplicationUrl(appId, url);
    }

    function addApplicationContract(uint64 appId, address wallet) public {
        validateAppExists(appId);
        validateAppOwner(appId, msg.sender);
        _addApplicationContract(appId, wallet);
    }

    function deleteApplicationUrl(uint64 appId, uint index) public {
        validateAppExists(appId);
        validateAppOwner(appId, msg.sender);
        _deleteApplicationUrl(appId, index);
    }

    function deleteApplicationContract(uint64 appId, uint index) public {
        validateAppExists(appId);
        validateAppOwner(appId, msg.sender);
        _deleteApplicationContract(appId, index);
    }

    function deleteApplication(uint64 appId) public {
        validateAppExists(appId);
        validateAppOwner(appId, msg.sender);
        _setApplicationActive(appId, false);
    }

    function restoreApplication(uint64 appId) public {
        //validateAppExists(appId);
        validateAppOwner(appId, msg.sender);
        _setApplicationActive(appId, true);
    }

    function createUser(bytes32 usernameHash) public payable {
        _createUser(usernameHash, msg.sender);
    }

    // todo implement method createUserWithAddress, where I can pass created wallet with limited admin permissions
    // (allow external apps etc)

    function createInvite(address payable inviteAddress) public payable {
        // todo only main session can create invite
        validateInviteAvailable(inviteAddress);
        validateAddressRegistered(msg.sender);
        bytes32 creatorUsername = getUsernameByAddress(msg.sender);
        getLoginStorage.setInvite(inviteAddress, GetLoginStorage.InviteInfo({inviteAddress : inviteAddress, creatorUsername : creatorUsername, registeredUsername : '', isActive : true}));
        inviteAddress.transfer(msg.value);
        getLoginStorage.emitEventInviteCreated(creatorUsername, inviteAddress);
    }

    function createUserFromInvite(bytes32 usernameHash, address payable walletAddress, string memory ciphertext, string memory iv, string memory salt, string memory mac, bool allowReset) public payable {
        validateInviteActive(msg.sender);
        require(isAddressRegistered(walletAddress) == false, "Address already registered");
        GetLoginStorage.InviteInfo memory invite = getLoginStorage.getInvite(msg.sender);
        _createUser(usernameHash, walletAddress);
        invite.isActive = false;
        invite.registeredUsername = usernameHash;
        getLoginStorage.setInvite(msg.sender, invite);
        walletAddress.transfer(msg.value);
        settingsInviteReset(allowReset);
        getLoginStorage.emitEventStoreWallet(usernameHash, walletAddress, ciphertext, iv, salt, mac);
    }

    function changePassword(address payable walletAddress, string memory ciphertext, string memory iv, string memory salt, string memory mac, SessionData[] memory sessions) public payable {
        validateAddressRegistered(msg.sender);
        validateAddressAvailable(walletAddress);
        bytes32 usernameHash = getUsernameByAddress(msg.sender);
        getLoginStorage.setUsersAddressUsername(walletAddress, GetLoginStorage.Username({username : usernameHash, isActive : true}));
        // deactivate old wallet
        getLoginStorage.setUsersAddressUsername(msg.sender, GetLoginStorage.Username({username : usernameHash, isActive : false}));
        //getLoginStorage.setUser(usernameHash, GetLoginStorage.UserInfo({username : usernameHash, isActive : false}));
        // todo check _addSessionInit is needed
        _addSessionInit(usernameHash, walletAddress, sessionMain, 0);
        walletAddress.transfer(msg.value);
        getLoginStorage.emitEventStoreWallet(usernameHash, walletAddress, ciphertext, iv, salt, mac);

        for (uint i = 0; i < sessions.length; i++) {
            SessionData memory session = sessions[i];
            getLoginStorage.emitEventAppSession(session.appId, usernameHash, session.iv, session.ephemPublicKey, session.ciphertext, session.mac);
        }
    }

    function createAppSession(uint64 appId, address payable wallet, string memory iv, string memory ephemPublicKey, string memory ciphertext, string memory mac) public payable {
        validateAddressRegistered(msg.sender);
        validateAppExists(appId);
        bytes32 username = getUsernameByAddress(msg.sender);
        // todo check only one main session possible
        // todo hide user apps ids?
        //_addSession(wallet, sessionApp, appId);
        //UsersAddressUsername[wallet] = Username({isActive : true, username : username});
        getLoginStorage.setUsersAddressUsername(wallet, GetLoginStorage.Username({isActive : true, username : username}));
        wallet.transfer(msg.value);
        getLoginStorage.emitEventAppSession(appId, username, iv, ephemPublicKey, ciphertext, mac);
    }

    /*function addMainSession(address wallet) public payable {
        validateAddressRegistered(msg.sender);
        _addSession(wallet, sessionApp, 0);
    }*/

    function setInviteReset(string memory value) public {
        _setSettings(msg.sender, settingsInviteReset, value);
    }

    /* End of public methods */

    /* View methods */
    function getApplication(uint64 id) public view returns (GetLoginStorage.Application memory) {
        validateAppExists(id);

        return getLoginStorage.getApplication(id);
    }

    /*function getAnyApplication(uint64 id) public view returns (GetLoginStorage.Application memory) {
        return Applications[id];
    }*/

    function getUserInfo(bytes32 usernameHash) public view returns (GetLoginStorage.UserInfo memory) {
        //return Users[usernameHash];
        return getLoginStorage.getUser(usernameHash);
    }

    function isUsernameExists(bytes32 usernameHash) public view returns (bool) {
        return getUserInfo(usernameHash).isActive;
    }

    function isAddressRegistered(address wallet) public view returns (bool) {
        GetLoginStorage.Username memory currentUser = getLoginStorage.getUsersAddressUsername(wallet);
        if (currentUser.isActive != true) {
            return false;
        }

        GetLoginStorage.UserInfo memory info = getLoginStorage.getUser(currentUser.username);

        return info.isActive;
    }

    function isAppOwner(uint64 appId, address checkAddress) public view returns (bool) {
        bytes32 currentUsernameHash = getUsernameByAddress(checkAddress);
        return getLoginStorage.getApplication(appId).usernameHash == currentUsernameHash;
    }

    function getUserByAddress(address wallet) public view returns (GetLoginStorage.UserInfo memory) {
        GetLoginStorage.Username memory currentUser = getLoginStorage.getUsersAddressUsername(wallet);
        require(currentUser.isActive, "User with this address not found");
        return getLoginStorage.getUser(currentUser.username);
    }

    function getUsernameByAddress(address wallet) public view returns (bytes32) {
        return getUserByAddress(wallet).username;
    }

    function isActiveInvite(address wallet) public view returns (bool) {
        GetLoginStorage.InviteInfo memory info = getLoginStorage.getInvite(wallet);
        return info.isActive;
    }

    function isInviteAddressUsed(address wallet) public view returns (bool) {
        GetLoginStorage.InviteInfo memory info = getLoginStorage.getInvite(wallet);
        return info.creatorUsername != '';
    }

    function getInvite(address wallet) public view returns (GetLoginStorage.InviteInfo memory) {
        return getLoginStorage.getInvite(wallet);
    }

    function getUserSessions(bytes32 usernameHash) public view returns (GetLoginStorage.UserSession[] memory) {
        return getLoginStorage.getUserSessions(usernameHash);
    }

    function getSettings(address wallet, string memory key) public view returns (string memory) {
        bytes32 usernameHash = getUsernameByAddress(wallet);
        // todo inspect is correct way / collisions possible
        bytes32 keyHash = keccak256(abi.encode(usernameHash, "_", key));
        return getLoginStorage.getSettings(keyHash);
    }

    function getInviteReset(address _address) public view returns (string memory) {
        return getSettings(_address, settingsInviteReset);
    }

    /* End of view methods */
}
