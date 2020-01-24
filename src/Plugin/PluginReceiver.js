import {getAllowedApp, getLocalUsername, getLocalUsernameHash} from "../reducers/actions";

export default class PluginReceiver {
    constructor() {
        this.allowedMethods = [
            'getUserInfo'
        ];
    }

    _listener = (event) => {
        if (typeof event.data !== 'object' || event.data.app !== 'get_login') {
            return;
        }

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

    async sendTransaction(transaction) {
        return {
            result: 'ok',
            transaction
        };
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
