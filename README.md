## GetLogin

### Description

GetLogin is a Đapp for providing a decentralized single sign-on solution for Ethereum-base social applications with a familiar (Web2.0-style) onboarding experience that does not require Ether or even any experience with Ethereum.

Initially, the user's account is protected by a user name and a password, but as the value of the account grows and the user becomes more familiar with Ethereum, it is possible to use a better protected Ethereum address (e.g. that of a hardware wallet) as the source of login credentials.

GetLogin comes with an invitation system. The gas costs of new users are covered by those who invited them and the latter are also their first point of contact for social account recovery in case of lost or compromised credentials.

GetLogin implements an [OpenID Connect](https://openid.net/) authentication through [OAuth 2](https://en.wikipedia.org/wiki/OAuth#OAuth_2.0) ([implicit flow](https://openid.net/specs/openid-connect-core-1_0.html#ImplicitFlowAuth) - client-side only).

Last project build hosted at [getlogin.org](https://getlogin.org).

[![ETHCC2020 - Daniel Nagy: "Decentralized User Account Management"](http://i3.ytimg.com/vi/vX3F4QyQRw8/maxresdefault.jpg)](https://www.youtube.com/watch?v=vX3F4QyQRw8)

### Register your app in GetLogin smart contract

1) Receive an invite (you can write to my email: igor.shadurin@gmail.com) and register account.
2) Use page to manage your application data: https://getlogin.org/

### Inject GetLogin to your dApp

Add this code to the app. If user authorize your app, you could use `GLInstance` to call GetLogin methods.

```javascript
<script>
    let GLInstance = null;
    const APP_ID = 2;
    const setAccessToken = token => {
        localStorage.setItem('access_token', token);
    };

    const getAccessToken = () => {
        return localStorage.getItem('access_token');
    };
    
    const script = document.createElement('script');
    script.src = `https://getlogin.org/api/last.js`;
    script.async = true;
    script.type = 'module';
    script.onload = async () => {
        const instance = new window._getLoginApi();
        GLInstance = instance;
        const result = await GLInstance.init(APP_ID, 'https://getlogin.org/', window.location.origin, getAccessToken());
        console.log('result', result);
        if (result.data.is_client_allowed) {
            console.log('User allowed this app, you could call some methods');
        } else {
            console.log('App currently not allowed by user');
        }
    };

    document.body.appendChild(script);
</script>
``` 
where `APP_ID` is your app which created here https://getlogin.org/developers

### Call built-in methods
```
const data = GLInstance.getUserInfo();
alert(JSON.stringify(data));
```

`getUserInfo()` - get current user information

`getSessionBalances()` - get session wallet balances (xDai, xBzz)

`getSessionPrivateKey()` - get session wallet private key

`isReady()` - check is iframe ready

`setClientAbi(abi)` - set your dApp ABI

`getClientAbi()` - get current ABI

`getAuthorizeUrl()` - get URL for authorize user in you dApp

`resetInit()` - reset iframe

`init(appId, baseApiUrl, redirectUrl, accessToken = null)` - init GetLogin. This promise return object `{authorize_url: string, is_client_allowed: boolean, client_id: int, type: "get_login_init"}`. `is_client_allowed` - is user authorized your dApp, if false - show `authorize_url` for authorization.

`logout()` - logout user from your dApp

`callContractMethod(address, method, ...params)` - call dApp contract method (read-only)

`sendTransaction(address, method, txParams, params)` - send transaction to your dApp contract

`setOnLogout(func)` - set callback when user logged out

`keccak256(data)` - get keccak256 hash from passed data

`getPastEvents(address, eventName, params)` - get events from contract

`getAccessTokenBalance()` - receive balance on access token
### Call dApp contract methods

Set contract ABI once before calling dApp methods: `window.getLoginApi.setClientAbi(abi);`

Call getNotes method which defined in your dApp contract: 

```javascript
const data = await GLInstance.callContractMethod(address, 'getNotes', usernameHash)
console.log(data);
```

`address` is your dApp address

Send transaction to your dApp contract: 
```javascript
const data = await GLInstance.sendTransaction(address, 'createNote', [noteText], {resolveMethod: 'mined'})
console.log(data);
```

`address` is your dapp address.

`createNote` is your dapp method defined in contract.

`noteText` content of your note.
                                                     
One important param is `resolveMethod`. Values of this param can be: 

`mined` - fired when tx sent and mined (slow)

`transactionHash` - when tx sent (fast)

### Deploying smart contracts

`cd src/smart`

Create `.env` file with private key.

`truffle deploy --reset --network poa`

or

`truffle deploy --reset --network xdai`

or for development

`truffle deploy --reset --network development`

Do the same with `src/smart-bzz` folder. This folder contains implementation of BZZ token.

### Building project

In the project directory, you can run:

`yarn` - install dependencies

`yarn build` - build project

`yarn start` - start project locally

### App examples

Reward system created with React - https://github.com/GetLoginEth/reward-system

### Donate ETH address

You can donate to developers of the project to Ethereum address: 0xde442ceD045ae30e076597C428876782b42D24cC
