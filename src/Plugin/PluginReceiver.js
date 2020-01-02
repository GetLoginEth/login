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

    init() {
        window.addEventListener('message', this._listener);
        window.parent.postMessage('get_login_init', '*');
    }
}
