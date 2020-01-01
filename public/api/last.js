class GetLoginApi {
    constructor() {
        this.url = null;
        this.iframe = null;
        this.isInitInProgress = false;
        /**
         * In seconds
         * @type {number}
         */
        this.sendMessageTimeout = 60;
    }

    /* _messageListener(data) {
         //console.log(data);
     }*/

    _randomUid() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    _sendMessage(method, data = null) {
        //console.log('call ' + method);
        if (!this.iframe) {
            throw new Error('Empty iframe');
        }

        const id = this._randomUid();
        return new Promise((resolve, reject) => {
            let timeout = setTimeout(() => {
                reject('Timeout error');
            }, this.sendMessageTimeout * 1000);
            const listener = (event) => {
                if (typeof event.data !== 'object' || event.data.id !== id) {
                    return;
                }

                clearTimeout(timeout);
                window.removeEventListener('message', listener);
                resolve(event);
            };
            window.addEventListener('message', listener);
            const message = {
                id,
                method,
                data
            };

            this.iframe.postMessage(message, this.url);
        });
    }

    _getWindow() {
        return new Promise((resolve => {
            let interval = setInterval(() => {
                if (window) {
                    clearInterval(interval);
                    resolve(window);
                }
            }, 100);
        }));
    }

    async init(url) {
        this.url = url;
        if (this.isInitInProgress) {
            throw new Error('Init in progress');
        }

        if (this.iframe) {
            throw new Error('Already init');
        }

        let isFrameLoaded = false;
        const waitFrameLoaded = async () => {
            return new Promise((resolve, reject) => {
                let interval = setInterval(() => {
                    if (isFrameLoaded) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
        };

        try {
            this.isInitInProgress = true;
            if (!url) {
                throw new Error('Incorrect url');
            }

            const window = await this._getWindow();
            const listener = (event) => {
                if (event.data === 'get_login_init') {
                    isFrameLoaded = true;
                    this.iframe = iframe.contentWindow;
                    window.removeEventListener('message', listener);
                }
            };
            window.addEventListener('message', listener);
            const iframe = document.createElement('iframe');
            iframe.style.display = "none";
            iframe.src = url;
            document.body.appendChild(iframe);
        } catch (e) {
            this.isInitInProgress = false;
            throw e;
        }

        await waitFrameLoaded();

        return true;
    }

    async test() {
        return this._sendMessage('test');
    }

    async testTwo() {
        return this._sendMessage('test_two');
    }
}
