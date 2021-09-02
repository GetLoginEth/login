import {appLogoutLocal, getAppInfo, getAppSession, getLocalUsername, getLocalUsernameHash} from "../reducers/actions";
import SessionContract from "../Lib/get-login/SessionContract";
import {beautyBalance} from "../Lib/get-login/utils";

export default class PluginReceiver {
    /**
     *
     * @type {Web3|null}
     */
    web3 = null;
    appId = null;
    accessToken = null;
    allowedOriginUrls = [];
    balance = null;
    app = null;

    constructor(web3) {
        this.web3 = web3;
        this.allowedMethods = [
            'getUserInfo',
            'getSessionBalances',
            'callContractMethod',
            'sendTransaction',
            'logout',
            'keccak256',
            'getPastEvents',
            'getAccessTokenBalance'
        ];
    }

    setData(balance, app) {
        this.balance = balance;
        this.app = app;
    }

    async init(clientId = null, accessToken = null) {
        const params = new URLSearchParams(window.location.search);

        if (!clientId) {
            clientId = params.get('client_id');
        }

        if (!clientId) {
            throw new Error('Incorrect client_id');
        }

        if (!accessToken) {
            accessToken = params.get('access_token');
        }

        // access token could be empty when app auth first time
        // if (!accessToken) {
        //     throw new Error('Incorrect accessToken');
        // }

        window.addEventListener('message', this._listener);
        try {
            const appInfo = await getAppInfo(clientId);
            this.allowedOriginUrls = appInfo.allowedUrls;
            //console.log(appInfo);
            const appSession = await getAppSession(clientId);
            //console.log(appSession);
            let is_client_allowed = false;
            let result = {
                type: 'get_login_init',
                client_id: clientId,
            };

            if (appSession && appSession.transactionHash === accessToken) {
                result.address = appSession.address;
                result.access_token = appSession.transactionHash;
                is_client_allowed = true;
            }

            result.is_client_allowed = is_client_allowed;
            result.username_hash = getLocalUsernameHash();
            // todo targetOrigin is specific domain?
            window.parent.postMessage(result, '*');
        } catch (e) {
            // todo handle exception
        }
    }

    getWeb3() {
        return this.web3;
    }

    setWeb3(web3) {
        this.web3 = web3;
    }

    _isUrlAllowed(url) {
        return !!this.allowedOriginUrls.find(item => (new URL(item)).origin === url);
    }

    _listener = async (event) => {
        if (typeof event.data !== 'object' || event.data.app !== 'get_login') {
            return;
        }

        this.appId = event.data.appId;
        this.accessToken = event.data.accessToken;
        if (!this._isUrlAllowed(event.origin)) {
            const errorMessage = 'Event origin url not allowed. Action skipped.';
            console.error(errorMessage);
            event.source.postMessage({
                id: event.data.id,
                error: errorMessage
            }, event.origin);
            return;
        }

        console.log('event', event.data);
        console.log('allowedMethods', this.allowedMethods);

        // todo check access_token and appId
        // todo access_token should be not tx hash, but hash from some data signed by private key, because tx is public
        // and can be compromised
        if (!event.data.method || !this.allowedMethods.includes(event.data.method)) {
            event.source.postMessage({
                id: event.data.id,
                error: 'Method not allowed'
            }, event.origin);
            return;
        }

        try {
            const result = await this[event.data.method](event.data.params);
            event.source.postMessage({
                id: event.data.id,
                result
            }, event.origin);
        } catch (e) {
            event.source.postMessage({
                id: event.data.id,
                error: 'Error on execution: ' + e.message,
            }, event.origin);
        }
    };

    async keccak256({data}) {
        //console.log('data', data);
        return this.getWeb3().utils.keccak256(data);
    }

    async getPastEvents({abi, address, eventName, params}) {
        const contract = new this.web3.eth.Contract(abi, address);

        return contract.getPastEvents(eventName, params);
    }

    async getUserInfo() {
        return {
            username: getLocalUsername(),
            usernameHash: getLocalUsernameHash()
        };
    }

    async getSessionBalances() {
        return {
            balance: this.balance,
            webCurrency: this.app.currency,
            bzzCurrency: this.app?.bzz?.name
        };
    }

    async sendTransaction({abi, address, method, txParams, params}) {
        const app = await getAppSession(this.appId);
        if (!app) {
            throw new Error('Access token not found');
        }

        const mainContract = new SessionContract({
            web3: this.web3,
            network: process.env.REACT_APP_NETWORK,
            address,
            abi
        });
        await mainContract.setPrivateKey(app.privateKey);

        return await mainContract.sendTx({method, params: txParams, settings: params});
    }

    async callContractMethod({abi, address, method, params}) {
        console.log(params);
        const contract = new this.web3.eth.Contract(abi, address);
        const isEmptyParams = !params || params.length === 0;

        return (isEmptyParams ? contract.methods[method]() : contract.methods[method](...params)).call();
    }

    async logout() {
        return await appLogoutLocal(this.appId)
    }

    /**
     * Get access token balance
     * @returns {Promise<{balanceWei: string, balanceWeb: string}>}
     */
    async getAccessTokenBalance() {
        const app = await getAppSession(this.appId);
        if (!app) {
            throw new Error('Access token not found');
        }

        const address = this.web3.eth.accounts.privateKeyToAccount(app.privateKey).address;
        const balanceWei = await this.web3.eth.getBalance(address);
        const balanceWeb = beautyBalance(this.web3.utils.fromWei(balanceWei, 'ether'), 4);

        return {
            balanceWei,
            balanceWeb
        };
    }
}
