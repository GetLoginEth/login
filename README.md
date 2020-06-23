## Available Scripts

### Description

GetLogin implements an [OpenID Connect](https://openid.net/) authentication through [OAuth 2](https://en.wikipedia.org/wiki/OAuth#OAuth_2.0) ([implicit flow](https://openid.net/specs/openid-connect-core-1_0.html#ImplicitFlowAuth) - client-side only).

Last project build hosted at [getlogin.eth](https://swarm-gateways.net/bzz:/getlogin.eth/).

[![ETHCC2020 - Daniel Nagy: "Decentralized User Account Management"](http://i3.ytimg.com/vi/vX3F4QyQRw8/maxresdefault.jpg)](https://www.youtube.com/watch?v=vX3F4QyQRw8)

### Register your app in GetLogin smart contract

1) Receive an invite (you can write to my email) and register account.
2) Use page to manage your application data: https://swarm-gateways.net/bzz:/getlogin.eth/developers

### Inject GetLogin to your dApp

Add code before footer: 

```javascript
window._onGetLoginApiLoaded = (instance) => {
    window.getLoginApi = instance;
    instance.init(appId, 'https://swarm-gateways.net/bzz:/getlogin.eth/', redirectUrl, accessToken)
    .then(data => {
        console.log(data);
    });
}
``` 
where `appId` is your app id stored in step 3 of registration app instruction, `redirectUrl` is your app url.

`accessToken` - is access token which you received early or `null`

Add `<script src="https://swarm-gateways.net/bzz:/getlogin.eth/api/last.js"></script>` to footer.
    
After loading the script, it will call the `window._onGetLoginApiLoaded` method and pass the GetLogin instance to it.                     
                           
### Call built-in methods
```
window.getLoginApi.getUserInfo()
    .then(data => alert(JSON.stringify(data)))
    .catch(e => alert(e));
```

`getUserInfo()` - get current user information

`isReady()` - check is iframe ready

`setClientAbi(abi)` - set your dApp ABI

`getClientAbi()` - get current ABI

`getAuthorizeUrl()` - get URL for authorize user in you dApp

`resetInit()` - reset iframe

`async init(appId, baseApiUrl, redirectUrl, accessToken = null)` - init GetLogin. This promise return object `{authorize_url: string, is_client_allowed: boolean, client_id: int, type: "get_login_init"}`. `is_client_allowed` - is user authorized your dApp, if false - show `authorize_url` for authorization.

`logout()` - logout user from your dApp

`async callContractMethod(address, method, ...params)` - call dApp contract method (read-only)

`async sendTransaction(address, method, txParams, params)` - send transaction to your dApp contract

`async setOnLogout(func)` - set callback when user logged out

`async keccak256(data)` - get keccak256 hash from passed data

`async getPastEvents(address, eventName, params)` - get events from contract
### Call dApp contract methods

Set contract ABI once before calling dApp methods: `window.getLoginApi.setClientAbi(abi);`

Call getNotes method which defined in your dapp contract: 

```javascript
window.getLoginApi.callContractMethod(address, 'getNotes', usernameHash)
.then(data => {
    console.log(data);
})
.catch(e => {
    console.log(e);
});
```

`address` is your dapp address

Send transaction to your dapp contract: 
```javascript
window.getLoginApi.sendTransaction(address, 'createNote', [noteText], {resolveMethod: 'mined'})
.then(data => {
    console.log(data);
})
.catch(e => {
    console.log(e);
});
```

`address` is your dapp address.

`createNote` is your dapp method defined in contract.

`noteText` content of your note.
                                                     
One important param is `resolveMethod`. Values of this param can be: 

`mined` - fired when tx sent and mined (slow)

`transactionHash` - when tx sent (fast)

### Building project
In the project directory, you can run:

`yarn` - install dependencies

`yarn build` - build project

`yarn start` - start project locally

