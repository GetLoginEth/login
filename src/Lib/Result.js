export class LoginError extends Error {
    constructor(code, ...params) {
        super(...params);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, LoginError)
        }

        //console.log(this);
        this.code = code;
        if (!this.message) {
            if (CODE_MESSAGES[code]) {
                this.message = CODE_MESSAGES[code] + ' (code: ' + code + ')';
            } else {
                this.message = 'Error code ' + code;
            }
        }
    }
}

export const throwLoginError = (code) => {
    throw new LoginError(code);
};

export const CODE_NOT_DEFINED = -1;
export const CODE_USERNAME_ALREADY_REGISTERED = 1;
export const CODE_UNKNOWN_METHOD = 2;
export const CODE_EMPTY_RESULT = 3;
export const CODE_NOT_IMPLEMENTED = 4;

export const CODE_MESSAGES = {
    [CODE_NOT_DEFINED]: 'Not defined',
    [CODE_USERNAME_ALREADY_REGISTERED]: 'Username already registered',
    [CODE_UNKNOWN_METHOD]: 'Unknown method',
    [CODE_EMPTY_RESULT]: 'Empty result',
    [CODE_NOT_IMPLEMENTED]: 'Not implemented',
};

export const RESULT_OK = 'ok';
export const RESULT_ERROR = 'error';

/*
export default class Result {
    constructor(status = RESULT_OK, text = '', data = {}) {
        this.result = {status, text, data};
    }

    getResult() {
        return this.result;
    }

    setResult(result) {
        this.result = result;

        return result;
    }
}
*/
