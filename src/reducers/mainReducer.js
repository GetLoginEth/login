export const reducer = (state, action) => {
    console.log('dispatch', action);
    const merge = (field, data) => {
        return {
            ...state,
            [field]: {...state[field], ...data}
        };
    };
    let data = {};
    switch (action.type) {
        case getStatus(ACTION_LOCAL_AUTH, STATUS_START):
            return merge('user', {status: USER_STATUS_CHECKING});
        case getStatus(ACTION_LOCAL_AUTH, STATUS_SUCCESS):
            return merge('user', {status: USER_STATUS_LOGGED, ...action.data});
        case getStatus(ACTION_LOCAL_AUTH, STATUS_FAIL):
            return merge('user', {status: USER_STATUS_NOT_LOGGED});

        case getStatus(ACTION_SIGNIN, STATUS_INIT):
            data = {log: [], status: '', inProcess: false, errorMessage: ''};
            return merge('signin', data);
        case getStatus(ACTION_SIGNIN, STATUS_START):
            data = {log: [], status: '', inProcess: true, errorMessage: ''};
            return merge('signin', data);
        case getStatus(ACTION_SIGNIN, STATUS_FAIL):
            data = {inProcess: false, errorMessage: action.data.message};
            return merge('signin', data);
        case getStatus(ACTION_SIGNIN, STATUS_SUCCESS):
            return merge('user', {status: USER_STATUS_LOGGED, username: action.data.username});
        case getStatus(ACTION_SIGNIN, STATUS_COMPLETE):
            data = {inProcess: false};
            return merge('signin', data);
        case getStatus(ACTION_SIGNIN, STATUS_LOG):
            data = {log: [...state.signin.log, action.data], status: action.data, inProcess: true};
            return merge('signin', data);

        case getStatus(ACTION_SIGNUP, STATUS_INIT):
            data = {log: [], status: '', inProcess: false, errorMessage: '', isMining: false};
            return merge('signup', data);
        case getStatus(ACTION_SIGNUP, STATUS_START):
            data = {log: [], status: '', inProcess: true, errorMessage: ''};
            return merge('signup', data);
        case getStatus(ACTION_SIGNUP, STATUS_FAIL):
            data = {inProcess: false, errorMessage: action.data.message};
            return merge('signup', data);
        case getStatus(ACTION_SIGNUP, STATUS_SUCCESS):
            data = {inProcess: false, isMining: true, minedInfo: {}};
            return merge('signup', data);
        case getStatus(ACTION_SIGNUP, STATUS_MINED):
            data = {isMining: false, minedInfo: action.data};
            return merge('signup', data);
        case getStatus(ACTION_SIGNUP, STATUS_COMPLETE):
            data = {inProcess: false};
            return merge('signup', data);
        case getStatus(ACTION_SIGNUP, STATUS_LOG):
            data = {log: [...state.signup.log, action.data], status: action.data, inProcess: true};
            return merge('signup', data);

        case getStatus(ACTION_LOGOUT, STATUS_SUCCESS):
            return merge('user', {status: USER_STATUS_NOT_LOGGED, username: ''});

        case getStatus(ACTION_APP_INFO, STATUS_START):
            data = {id: action.data, title: '', description: '', inProcess: true, errorMessage: ''};
            return merge('authorizeApp', data);
        case getStatus(ACTION_APP_INFO, STATUS_FAIL):
            data = {inProcess: false, errorMessage: action.data.message};
            return merge('authorizeApp', data);
        case getStatus(ACTION_APP_INFO, STATUS_SUCCESS):
            data = {
                id: action.data.id,
                title: action.data.title,
                description: action.data.description,
                inProcess: false
            };
            return merge('authorizeApp', data);

        case getStatus(ACTION_SELF_APP_INFO, STATUS_INIT):
            return merge('app', action.data);
        default:
            return state;
    }
};

export const USER_STATUS_NOT_LOGGED = 'not_logged';
export const USER_STATUS_LOGGED = 'logged';
export const USER_STATUS_CHECKING = 'checking_auth';

export const initialState = {
    user: {
        isLoggedIn: function () {
            return this.status === USER_STATUS_LOGGED;
        },
        isCheckingAuth: function () {
            return this.status === USER_STATUS_CHECKING;
        },
        status: USER_STATUS_NOT_LOGGED,
        username: ''
    },
    signup: {
        inProcess: false,
        isMining: false,
        minedInfo: {},
        status: '',
        log: [],
        errorMessage: ''
    },
    signin: {
        inProcess: false,
        status: '',
        log: [],
        errorMessage: ''
    },
    app: {
        network: '',
        provider: '',
        smartContractAddress: ''
    },
    authorizeApp: {
        id: null,
        title: '',
        description: '',
        inProcess: false,
        errorMessage: ''
    }
};

export const STATUS_INIT = 'init';
export const STATUS_START = 'start';
export const STATUS_SUCCESS = 'success';
export const STATUS_FAIL = 'fail';
export const STATUS_COMPLETE = 'complete';
export const STATUS_LOG = 'log';

export const STATUS_MINED = 'mined';

export const getStatus = (action, status) => {
    return `${action}_${status}`;
};

export const ACTION_LOCAL_AUTH = 'local_auth';
export const ACTION_SIGNIN = 'signin';
export const ACTION_LOGOUT = 'logout';
export const ACTION_SIGNUP = 'signup';
export const ACTION_SELF_APP_INFO = 'self_app_info';
export const ACTION_APP_INFO = 'app_info';
export const ACTION_ALLOW_APP = 'allow_app';
export const ACTION_GET_ALLOWED_APP = 'allowed_app';
