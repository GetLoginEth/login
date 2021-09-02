export class GetLoginApi {
    constructor() {
        this.appId = null;
        this.baseUrl = null;
        this.pluginUrl = null;
        this.authUrl = null;
        this.redirectUrl = null;
        this.iframe = null;
        this.isInitInProgress = false;
        this.accessToken = '';
        this.usernameHash = '';
        this.address = '';
        this.clientAbi = [];

        /**
         * In seconds
         * @type {number}
         */
        this.sendMessageTimeout = 60;
        this.onLogout = null;
    }

    _randomUid() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    _sendMessage(accessToken, method, params = null) {
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
                appId: this.appId,
                accessToken,
                method,
                params
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

    /**
     * Get is app ready to use
     * @returns {boolean}
     */
    isReady() {
        return !!this.iframe;
    }

    /**
     * Set ABI for dApp that uses API
     * @param abi
     */
    setClientAbi(abi) {
        this.clientAbi = abi;
    }

    /**
     * Get ABI for dApp that uses API
     * @returns {[]}
     */
    getClientAbi() {
        return this.clientAbi;
    }

    /**
     * Get url for app authorization
     * @param appId
     * @param redirectUrl
     * @returns {string}
     */
    getAuthorizeUrl(appId = this.appId, redirectUrl = this.redirectUrl) {
        [appId, this.authUrl, redirectUrl].forEach(item => {
            if (!item) {
                throw new Error('Incorrect params');
            }
        });

        return `${this.authUrl}?client_id=${appId}&response_type=id_token&redirect_uri=${redirectUrl}`;
    }

    /**
     * Reset initialization
     */
    resetInit() {
        if (this.iframe) {
            this.iframe = null;
        }

        this.isInitInProgress = false;
    }

    /**
     * Init application
     * @param appId
     * @param baseApiUrl
     * @param redirectUrl
     * @param accessToken
     * @returns {Promise<{result: boolean, data: {}}>}
     */
    async init(appId, baseApiUrl, redirectUrl, accessToken = null) {
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
        this.pluginUrl = `${baseApiUrl}xplugin?client_id=${appId}&access_token=${accessToken}`;
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

        this.accessToken = answerData.access_token;
        this.usernameHash = answerData.username_hash;
        this.address = answerData.address;

        return {
            result: true,
            data: answerData
        };
    }

    /**
     * Get current active user info
     * @returns {Promise<unknown>}
     */
    async getUserInfo() {
        return this._sendMessage(this.accessToken, 'getUserInfo');
    }

    /**
     * Get session wallet balances
     * @returns {Promise<unknown>}
     */
    async getSessionBalances() {
        return this._sendMessage(this.accessToken, 'getSessionBalances');
    }

    /**
     * Get private key of session wallet
     * @returns {Promise<unknown>}
     */
    async getSessionPrivateKey() {
        return this._sendMessage(this.accessToken, 'getSessionPrivateKey');
    }

    /**
     * Logout
     * @returns {Promise<boolean>}
     */
    async logout() {
        await this._sendMessage(this.accessToken, 'logout');
        if (this.onLogout) {
            this.onLogout();
        }

        return true;
    }

    /**
     * Call smart contract method (read-only)
     * @param address
     * @param method
     * @param params
     * @returns {Promise<unknown>}
     */
    async callContractMethod(address, method, ...params) {
        const abi = this.getClientAbi();
        if (!abi) {
            throw new Error('Empty abi');
        }

        return this._sendMessage(this.accessToken, 'callContractMethod', {
            abi: this.getClientAbi(),
            address,
            method,
            params
        });
    }

    /**
     * Send transaction to smart contract
     * @param address
     * @param method
     * @param txParams
     * @param params
     * @returns {Promise<unknown>}
     */
    async sendTransaction(address, method, txParams, params) {
        const abi = this.getClientAbi();
        if (!abi) {
            throw new Error('Empty abi');
        }

        return this._sendMessage(this.accessToken, 'sendTransaction', {
            abi: this.getClientAbi(),
            address,
            method,
            txParams,
            params
        });
    }

    /**
     * Return hashed data with keccak256 (using web3 lib)
     * @param data
     * @returns {Promise<string>}
     */
    async keccak256(data) {
        return this._sendMessage(this.accessToken, 'keccak256', {data});
    }

    /**
     * Get past events from contract
     * @param address
     * @param eventName
     * @param params
     * @returns {Promise<unknown>}
     */
    async getPastEvents(address, eventName, params) {
        return this._sendMessage(this.accessToken, 'getPastEvents', {
            abi: this.getClientAbi(),
            address,
            eventName,
            params
        });
    }

    /**
     * Set logout callback function
     * @param func
     */
    setOnLogout(func) {
        this.onLogout = func;
    }

    /**
     * Get current user access token balance
     * @returns {Promise<string>}
     */
    async getAccessTokenBalance() {
        return this._sendMessage(this.accessToken, 'getAccessTokenBalance');
    }
}

// const GLInstance = new GetLoginApi();
// if (window && window._onGetLoginApiLoaded) {
//     window._onGetLoginApiLoaded(GLInstance);
//     delete window._onGetLoginApiLoaded;
// } else if (window) {
//     window._getLoginInstance = GLInstance;
// }
window._getLoginApi = GetLoginApi;
