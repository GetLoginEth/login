import {getAllowedApp} from "../reducers/actions";

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
            username: 'satoshi',
            one: 'two'
        };
    }

    init(clientId = null) {
        if (!clientId) {
            const params = new URLSearchParams(window.location.search);
            clientId = params.get('client_id');
            console.log('clientId', clientId);
        }

        if (!clientId) {
            throw new Error('Incorrect client_id');
        }

        window.addEventListener('message', this._listener);
        getAllowedApp(clientId).then(access_token => {
            console.log(access_token);
            const is_client_allowed = !!access_token;
            window.parent.postMessage({
                'type': 'get_login_init',
                'client_id': clientId,
                access_token,
                is_client_allowed
            }, '*');
        });

    }
}
