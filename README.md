## Available Scripts

### Description

GetLogin implements an [OpenID Connect](https://openid.net/) authentication through [OAuth 2](https://en.wikipedia.org/wiki/OAuth#OAuth_2.0) ([implicit flow](https://openid.net/specs/openid-connect-core-1_0.html#ImplicitFlowAuth) - client-side only).

Last project build hosted at [getlogin.eth](https://swarm-gateways.net/bzz:/getlogin.eth/).

### Register your app in GetLogin smart contract

1) Get last contract address (rinkeby) in file `src/Lib/get-login/contract.js`

2) Register as user with method `createUser(usernameHash)` where `usernameHash` is keccak256 hash of your username. Or pass if you already registered.

3) Register application with method `createApplication`. Store application id which will return this method.

4) Add allowed application urls (urls where your app is hosted) with `addApplicationUrl`

### Inject GetLogin to your dApp

Add `<script async src="https://swarm-gateways.net/bzz:/getlogin.eth/api/last.js"></script>` to `<head>`

Init: `window.getLoginApi.init(appId, 'https://swarm-gateways.net/bzz:/getlogin.eth/', redirectUrl).then(data => {
                               alert(data);
                           });` where `appId` is your app id stored in step 3 of registration app instruction, `redirectUrl` is your app url.
                           
Call methods: `window.getLoginApi.getUserInfo().then(data => alert(JSON.stringify(data))).catch(e => alert(e));`

### Call dApp contract methods

Set contract ABI: `window.getLoginApi.setClientAbi(abi);`

Call getNotes method: `window.getLoginApi.callContractMethod(address, 'getNotes', usernameHash)
            .then(data => {
                console.log(data);
            })
            .catch(e => {
                console.log(e);
            });`

Send transaction to contract: `window.getLoginApi.sendTransaction(address, 'createNote', noteText)
                                                           .then(data => {
                                                               console.log(data);
                                                           })
                                                           .catch(e => {
                                                               console.log(e);
                                                           })`

### Building project
In the project directory, you can run:

`yarn` - install dependencies

`yarn build` - build project

`yarn start` - start project locally

