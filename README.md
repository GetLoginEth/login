## Available Scripts

### Description

GetLogin implements an [OpenID Connect](https://openid.net/) authentication through [OAuth 2](https://en.wikipedia.org/wiki/OAuth#OAuth_2.0) ([implicit flow](https://openid.net/specs/openid-connect-core-1_0.html#ImplicitFlowAuth) - client-side only).

Last project build hosted at [getlogin.eth](https://swarm-gateways.net/bzz:/getlogin.eth/).

### Register your app in GetLogin smart contract

1) Get last contract address from url: `https://swarm-gateways.net/bzz:/getlogin.eth/xsettings`

2) Register as user with method `createUser(usernameHash)` where `usernameHash` is keccak256 hash of your username. Or pass if you already registered.

3) Register application with method `createApplication`. Store application id which will return this method.

4) Add allowed application urls (urls where your app is hosted) with `addApplicationUrl`

### Inject GetLogin to your dApp

Add `<script async src="https://swarm-gateways.net/bzz:/getlogin.eth/api/last.js"></script>` to `<head>`

Init: 

```javascript
window.getLoginApi.init(appId, 'https://swarm-gateways.net/bzz:/getlogin.eth/', redirectUrl)
.then(data => {
    console.log(data);
});
``` 
                           
where `appId` is your app id stored in step 3 of registration app instruction, `redirectUrl` is your app url.
                           
Call methods: `window.getLoginApi.getUserInfo().then(data => alert(JSON.stringify(data))).catch(e => alert(e));`

### Call dApp contract methods

Set contract ABI: `window.getLoginApi.setClientAbi(abi);`

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
window.getLoginApi.sendTransaction(address, 'createNote', noteText, {resolveMethod: 'mined'})
.then(data => {
    console.log(data);
})
.catch(e => {
    console.log(e);
});
```

`address` is your dapp address

`createNote` is your dapp method defined in contract
                                                     
One important param is `resolveMethod`. Values of this param can be: 

'mined' - fired when tx sent and mined (slow)

'transactionHash' - when tx sent (fast)

### Building project
In the project directory, you can run:

`yarn` - install dependencies

`yarn build` - build project

`yarn start` - start project locally

