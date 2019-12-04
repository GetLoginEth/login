import Logger from "./logger";

export const SIGN_IN_LOGIN_PASSWORD = 'login_password';
export const SIGN_IN_BROWSER_DATA = 'sign_in_browser_data';
export const SIGN_IN_WEB3 = 'sign_in_web3';
export const SIGN_IN_TREZOR = 'sign_in_trezor';

export const SIGN_IN_RESULT_SUCCESS = 'success';
export const SIGN_IN_RESULT_ERROR = 'error';
export const SIGN_IN_ERROR_METHOD_NOT_SUPPORTED = 'Method not supported';

export default class Signin extends Logger {
    /**
     * Sign in user
     * @param method
     * @param data
     * @returns {Promise<void>}
     */
    async signIn(method, data = {}) {
        //this.log(LOG_SIGN_IN_START, {method});
        let returnResult = {};
        const setResult = (result, text = '') => {
            returnResult = {result, text};
        };

        setResult(SIGN_IN_RESULT_ERROR, SIGN_IN_ERROR_METHOD_NOT_SUPPORTED);
        switch (method) {
            case SIGN_IN_LOGIN_PASSWORD:
                setResult(SIGN_IN_RESULT_SUCCESS);

                break;
            case SIGN_IN_BROWSER_DATA:
                setResult(SIGN_IN_RESULT_SUCCESS);

                break;
            case SIGN_IN_TREZOR:
                setResult(SIGN_IN_RESULT_SUCCESS);

                break;
            default:
                break;
        }

        //this.log(LOG_SIGN_IN_COMPLETE, returnResult);

        return returnResult;
    }
}
