import {getAllowedApp, getLocalUsername, getLocalUsernameHash} from "../reducers/actions";

export default class PluginReceiver {
    /**
     *
     * @type {Web3|null}
     */
    web3 = null;

    constructor(web3) {
        this.web3 = web3;
        this.allowedMethods = [
            'getUserInfo',
            'callContractMethod'
        ];
    }

    getWeb3() {
        return this.web3;
    }

    setWeb3(web3) {
        this.web3 = web3;
    }

    _listener = (event) => {
        //console.log(event);
        if (typeof event.data !== 'object' || event.data.app !== 'get_login') {
            return;
        }

        // todo check access_token
        if (!event.data.method || !this.allowedMethods.includes(event.data.method)) {
            event.source.postMessage({
                id: event.data.id,
                error: 'Method not allowed'
            }, event.origin);
            return;
        }

        this[event.data.method](event.data.params)
            .then(result => {
                event.source.postMessage({
                    id: event.data.id,
                    result
                }, event.origin);
            })
            .catch(e => {
                event.source.postMessage({
                    id: event.data.id,
                    error: 'Error on execution: ' + e.message,
                }, event.origin);
            });
    };

    async getUserInfo() {
        return {
            username: getLocalUsername(),
            usernameHash: getLocalUsernameHash()
        };
    }

    async sendTransaction({transaction}) {
        return {
            result: 'ok',
            transaction
        };
    }

    async callContractMethod({abi, address, method, params}) {
        const contract = new this.web3.eth.Contract(abi, address);

        return contract.methods[method](params).call();
    }

    init(clientId = null) {
        if (!clientId) {
            const params = new URLSearchParams(window.location.search);
            clientId = params.get('client_id');
        }

        if (!clientId) {
            throw new Error('Incorrect client_id');
        }

        window.addEventListener('message', this._listener);
        getAllowedApp(clientId)
            .then(info => {
                const is_client_allowed = !!info;
                let result = {
                    type: 'get_login_init',
                    client_id: clientId,
                    is_client_allowed
                };
                if (info) {
                    result.access_token = info.transactionHash;
                }

                window.parent.postMessage(result, '*');
            });
    }
}
