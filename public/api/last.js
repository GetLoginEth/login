class GetLoginApi {
    appId = null;
    baseUrl = null;
    pluginUrl = null;
    authUrl = null;
    redirectUrl = null;
    iframe = null;
    isInitInProgress = false;
    /**
     * In seconds
     * @type {number}
     */
    sendMessageTimeout = 60;

    /*constructor() {
    }*/

    isReady() {
        return !!this.iframe;
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

                if (event.data.result) {
                    resolve(event.data.result);
                } else {
                    reject(event.data.error ? event.data.error : 'Unknown error');
                }
            };
            window.addEventListener('message', listener);
            const message = {
                id,
                app: 'get_login',
                method,
                data
            };

            this.iframe.postMessage(message, this.pluginUrl);
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

    getAuthorizeUrl(appId = this.appId, redirectUrl = this.redirectUrl) {
        [appId, this.authUrl, redirectUrl].forEach(item => {
            if (!item) {
                throw new Error('Incorrect params');
            }
        });

        return `${this.authUrl}?client_id=${appId}&response_type=id_token&redirect_uri=${redirectUrl}`;
    }

    async init(appId, baseApiUrl, redirectUrl) {
        [appId, baseApiUrl, redirectUrl].forEach(item => {
            if (!item) {
                throw new Error('Incorrect params');
            }
        });

        if (this.isInitInProgress) {
            throw new Error('Init in progress');
        }

        if (this.iframe) {
            throw new Error('Already init');
        }

        this.appId = appId;
        this.baseUrl = baseApiUrl;
        this.pluginUrl = `${baseApiUrl}xplugin?client_id=${appId}`;
        this.authUrl = `${baseApiUrl}xauthorize`;
        this.redirectUrl = redirectUrl;
        let isFrameLoaded = false;
        let answerData = {};
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
            if (!this.pluginUrl) {
                throw new Error('Incorrect url');
            }

            const window = await this._getWindow();
            const listener = (event) => {
                const data = event.data;
                if (typeof data === 'object' && data.type === 'get_login_init') {
                    answerData = {...data, authorize_url: this.getAuthorizeUrl()};
                    isFrameLoaded = true;
                    this.iframe = iframe.contentWindow;
                    window.removeEventListener('message', listener);
                }
            };
            window.addEventListener('message', listener);
            const iframe = document.createElement('iframe');
            iframe.style.display = "none";
            iframe.src = this.pluginUrl;
            document.body.appendChild(iframe);
        } catch (e) {
            this.isInitInProgress = false;
            throw e;
        }

        await waitFrameLoaded();

        return {
            result: true,
            data: answerData
        };
    }

    async getUserInfo() {
        // todo send with access token to validate is authorized
        return this._sendMessage('getUserInfo');
    }
}

window.getLoginApi = new GetLoginApi();
