## Available Scripts

### Description

GetLogin implements an [OpenID Connect](https://openid.net/) authentication through [OAuth 2](https://en.wikipedia.org/wiki/OAuth#OAuth_2.0) ([implicit flow](https://openid.net/specs/openid-connect-core-1_0.html#ImplicitFlowAuth) - client-side only).

Last project build hosted at [getlogin.eth](https://swarm-gateways.net/bzz:/getlogin.eth/).

### Inject GetLogin to your dApp

Add `<script async src="https://swarm-gateways.net/bzz:/getlogin.eth/api/last.js"></script>` to `<head>`

Init: `window.getLoginApi.init(pluginUrl).then(data => {
                               alert(data);
                           });`
                           
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

