import {getConfig} from '../config';

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
            if (action.data && action.data.isQuiet) {
                return state;
            } else {
                return merge('user', {status: USER_STATUS_CHECKING});
            }
        case getStatus(ACTION_LOCAL_AUTH, STATUS_SUCCESS):
            return merge('user', {status: USER_STATUS_LOGGED, ...action.data});
        case getStatus(ACTION_LOCAL_AUTH, STATUS_FAIL):
            return merge('user', {status: USER_STATUS_NOT_LOGGED});

        case getStatus(ACTION_SIGNIN, STATUS_INIT):
            /*data = {log: [], status: '', inProcess: false, errorMessage: ''};
            return merge('signin', data);*/
            return initialState;
        case getStatus(ACTION_SIGNIN, STATUS_START):
            data = {log: [], status: '', inProcess: true, errorMessage: ''};
            return merge('signin', data);
        case getStatus(ACTION_SIGNIN, STATUS_FAIL):
            data = {inProcess: false, errorMessage: action.data.message};
            return merge('signin', data);
        case getStatus(ACTION_SIGNIN, STATUS_SUCCESS):
            return merge('user', {
                status: USER_STATUS_LOGGED,
                username: action.data.username,
                usernameHash: action.data.usernameHash
            });
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

        case getStatus(ACTION_CHANGE_PASSWORD, STATUS_INIT):
            data = {log: [], status: '', inProcess: false, errorMessage: ''};
            return merge('password', data);
        case getStatus(ACTION_CHANGE_PASSWORD, STATUS_START):
            data = {log: [], status: '', inProcess: true, errorMessage: ''};
            return merge('password', data);
        case getStatus(ACTION_CHANGE_PASSWORD, STATUS_FAIL):
            data = {errorMessage: action.data.message};
            return merge('password', data);
        case getStatus(ACTION_CHANGE_PASSWORD, STATUS_COMPLETE):
            data = {inProcess: false};
            return merge('password', data);
        case getStatus(ACTION_CHANGE_PASSWORD, STATUS_LOG):
            data = {log: [...state.password.log, action.data], status: action.data, inProcess: true};
            return merge('password', data);

        case getStatus(ACTION_CREATE_INVITE, STATUS_START):
            data = {inProcessCreation: true, errorMessage: ''};
            return merge('invite', data);
        case getStatus(ACTION_CREATE_INVITE, STATUS_FAIL):
            data = {errorMessage: action.data.message};
            return merge('invite', data);
        case getStatus(ACTION_CREATE_INVITE, STATUS_SUCCESS):
            data = {createdInvites: [...state.invite.createdInvites, action.data]};
            return merge('invite', data);
        case getStatus(ACTION_CREATE_INVITE, STATUS_COMPLETE):
            data = {inProcessCreation: false};
            return merge('invite', data);

        case getStatus(ACTION_GET_INVITES, STATUS_INIT):
            data = {
                log: [],
                status: '',
                inProcessCreation: false,
                inProcessReceiving: false,
                errorMessage: '',
                invites: []
            };
            return merge('invite', data);
        case getStatus(ACTION_GET_INVITES, STATUS_START):
            data = {
                log: [],
                status: '',
                inProcessCreation: false,
                inProcessReceiving: true,
                errorMessage: '',
                invites: []
            };
            return merge('invite', data);
        case getStatus(ACTION_GET_INVITES, STATUS_FAIL):
            data = {errorMessage: action.data.message};
            return merge('invite', data);
        case getStatus(ACTION_GET_INVITES, STATUS_SUCCESS):
            data = {invites: action.data};
            return merge('invite', data);
        case getStatus(ACTION_GET_INVITES, STATUS_COMPLETE):
            data = {inProcessReceiving: false};
            return merge('invite', data);
        case getStatus(ACTION_GET_INVITES, STATUS_LOG):
            data = {log: [...state.invite.log, action.data], status: action.data, inProcessReceiving: true};
            return merge('invite', data);

        case getStatus(ACTION_GET_INVITE, STATUS_SUCCESS):
            data = {inviteInfo: {...state.invite.inviteInfo, [action.data.inviteAddress]: action.data}};
            //console.log(data);
            return merge('invite', data);

        case getStatus(ACTION_LOGOUT, STATUS_SUCCESS):
            //return merge('user', {status: USER_STATUS_NOT_LOGGED, username: ''});
            return initialState;

        case getStatus(ACTION_GET_BALANCE, STATUS_SUCCESS):
            //console.log(action.data);
            return merge('user', {balance: action.data});

        case getStatus(ACTION_APP_INFO, STATUS_START):
            data = {
                id: action.data,
                allowedUrls: [],
                title: '',
                description: '',
                isAppLoading: true,
                errorMessage: ''
            };
            return merge('authorizeApp', data);
        case getStatus(ACTION_APP_INFO, STATUS_FAIL):
            data = {isAppLoading: false, errorMessage: action.data.message};
            return merge('authorizeApp', data);
        case getStatus(ACTION_APP_INFO, STATUS_SUCCESS):
            data = {
                id: action.data.id,
                usernameHash: action.data.usernameHash,
                title: action.data.title,
                description: action.data.description,
                allowedUrls: action.data.allowedUrls,
                isAppLoading: false
            };
            return merge('authorizeApp', data);

        case getStatus(ACTION_SESSION, STATUS_START):
            data = {log: [], status: '', isSessionCreating: true, errorMessage: ''};
            return merge('authorizeApp', data);
        /*case getStatus(ACTION_SESSION, STATUS_FAIL):
            data = {inProcess: false, errorMessage: action.data.message};
            return merge('authorizeApp', data);
        case getStatus(ACTION_SESSION, STATUS_SUCCESS):
            data = {
                id: action.data.id,
                title: action.data.title,
                description: action.data.description,
                inProcess: false
            };
            return merge('authorizeApp', data);*/
        case getStatus(ACTION_SESSION, STATUS_COMPLETE):
            data = {log: [], status: '', isSessionCreating: false};
            return merge('authorizeApp', data);
        case getStatus(ACTION_SESSION, STATUS_LOG):
            data = {log: [...state.authorizeApp.log, action.data], status: action.data, isSessionCreating: true};
            return merge('authorizeApp', data);

        case getStatus(ACTION_GET_MY_APPS, STATUS_START):
            data = {inProcessReceiving: true, errorMessage: ''};
            return merge('myApps', data);
        case getStatus(ACTION_GET_MY_APPS, STATUS_FAIL):
            data = {errorMessage: action.data.message};
            return merge('myApps', data);
        case getStatus(ACTION_GET_MY_APPS, STATUS_SUCCESS):
            data = {apps: action.data};
            return merge('myApps', data);
        case getStatus(ACTION_GET_MY_APPS, STATUS_COMPLETE):
            data = {inProcessReceiving: false,};
            return merge('myApps', data);

        case getStatus(ACTION_CREATE_MY_APP, STATUS_START):
            data = {inProcessCreation: true, errorMessage: ''};
            return merge('myApps', data);
        case getStatus(ACTION_CREATE_MY_APP, STATUS_FAIL):
            data = {errorMessage: action.data.message};
            return merge('myApps', data);
        /*case getStatus(ACTION_CREATE_MY_APP, STATUS_SUCCESS):
            data = {apps: action.data};
            return merge('myApps', data);*/
        case getStatus(ACTION_CREATE_MY_APP, STATUS_COMPLETE):
            data = {inProcessCreation: false,};
            return merge('myApps', data);

        case getStatus(ACTION_GET_MY_APPS_INFO, STATUS_START):
            data = {inProcessReceiving: true, errorMessage: ''};
            return merge('appsInfo', data);
        case getStatus(ACTION_GET_MY_APPS_INFO, STATUS_FAIL):
            data = {errorMessage: action.data.message};
            return merge('appsInfo', data);
        case getStatus(ACTION_GET_MY_APPS_INFO, STATUS_SUCCESS):
            //data = {apps: action.data};
            return merge('appsInfo', action.data);
        case getStatus(ACTION_GET_MY_APPS_INFO, STATUS_COMPLETE):
            data = {inProcessReceiving: false,};
            return merge('appsInfo', data);

        case getStatus(ACTION_GET_MY_SESSIONS, STATUS_START):
            data = {inProcessReceiving: true, errorMessage: ''};
            return merge('mySessions', data);
        case getStatus(ACTION_GET_MY_SESSIONS, STATUS_FAIL):
            data = {errorMessage: action.data.message};
            return merge('mySessions', data);
        case getStatus(ACTION_GET_MY_SESSIONS, STATUS_SUCCESS):
            data = {sessions: action.data};
            return merge('mySessions', data);
        case getStatus(ACTION_GET_MY_SESSIONS, STATUS_COMPLETE):
            data = {inProcessReceiving: false,};
            return merge('mySessions', data);

        case getStatus(ACTION_GET_TREZOR_ADDRESSES, STATUS_START):
            data = {inProcessReceiving: true, errorMessage: ''};
            return merge('trezorAddresses', data);
        case getStatus(ACTION_GET_TREZOR_ADDRESSES, STATUS_FAIL):
            data = {errorMessage: action.data.message};
            return merge('trezorAddresses', data);
        case getStatus(ACTION_GET_TREZOR_ADDRESSES, STATUS_SUCCESS):
            data = {addresses: action.data.addresses, publicKey: action.data.publicKey};
            return merge('trezorAddresses', data);
        case getStatus(ACTION_GET_TREZOR_ADDRESSES, STATUS_COMPLETE):
            data = {inProcessReceiving: false,};
            return merge('trezorAddresses', data);

        case getStatus(ACTION_EDIT_MY_APP, STATUS_START):
            data = {inProcessEditing: true, errorMessage: ''};
            return merge('myApps', data);
        case getStatus(ACTION_EDIT_MY_APP, STATUS_FAIL):
            data = {errorMessage: action.data.message};
            return merge('myApps', data);
        case getStatus(ACTION_EDIT_MY_APP, STATUS_SUCCESS):
            //data = {apps: action.data};
            //return merge('myApps', action.data);
            return state;
        case getStatus(ACTION_EDIT_MY_APP, STATUS_COMPLETE):
            data = {inProcessEditing: false,};
            return merge('myApps', data);

        case getStatus(ACTION_RESET_PASSWORD, STATUS_START):
            data = {inProcess: true, errorMessage: ''};
            return merge('resetPasswordData', data);
        case getStatus(ACTION_RESET_PASSWORD, STATUS_FAIL):
            data = {errorMessage: action.data.message};
            return merge('resetPasswordData', data);
        /*case getStatus(ACTION_RESET_PASSWORD, STATUS_SUCCESS):
            return state;*/
        case getStatus(ACTION_RESET_PASSWORD, STATUS_COMPLETE):
            data = {inProcess: false,};
            return merge('resetPasswordData', data);

        case getStatus(ACTION_SET_INVITE_RESET, STATUS_START):
            data = {inProcess: true};
            return merge('settings', data);
        case getStatus(ACTION_SET_INVITE_RESET, STATUS_SUCCESS):
            data = {inviteReset: action.data.toString()};
            return merge('settings', data);
        case getStatus(ACTION_SET_INVITE_RESET, STATUS_COMPLETE):
            data = {inProcess: false};
            return merge('settings', data);

        case getStatus(ACTION_GET_INVITE_INFO, STATUS_START):
            data = {info: {inProcess: true, errorMessage: ''}};
            return merge('invite', data);
        case getStatus(ACTION_GET_INVITE_INFO, STATUS_SUCCESS):
            data = {info: action.data};
            return merge('invite', data);
        case getStatus(ACTION_GET_INVITE_INFO, STATUS_COMPLETE):
            data = {info: {...state.invite.info, inProcess: false}};
            return merge('invite', data);

        case getStatus(ACTION_GET_SETTINGS, STATUS_START):
            data = {inProcess: true};
            return merge('settings', data);
        case getStatus(ACTION_GET_SETTINGS, STATUS_SUCCESS):
            return merge('settings', action.data);
        case getStatus(ACTION_GET_SETTINGS, STATUS_COMPLETE):
            data = {inProcess: false};
            return merge('settings', data);

        case getStatus(ACTION_GET_SESSION_APP, STATUS_START):
            data = {inProcess: true, errorMessage: ''};
            return merge('sessionApp', data);
        case getStatus(ACTION_GET_SESSION_APP, STATUS_SUCCESS):
            return merge('sessionApp', action.data);
        case getStatus(ACTION_GET_SESSION_APP, STATUS_FAIL):
            data = {errorMessage: action.data.message};
            return merge('sessionApp', data);
        case getStatus(ACTION_GET_SESSION_APP, STATUS_COMPLETE):
            data = {inProcess: false};
            return merge('sessionApp', data);

        case getStatus(ACTION_CLOSE_SESSION, STATUS_START):
            data = {inProcessClose: true, closeId: action.data.logId};
            return merge('mySessions', data);
        case getStatus(ACTION_CLOSE_SESSION, STATUS_SUCCESS):
            // JSON.stringify/parse because object not correct clones
            let sessions = JSON.parse(JSON.stringify(state.mySessions.sessions));
            sessions = sessions.map(sourceItem => {
                const item = {...sourceItem};
                if (item.id === action.startData.logId) {
                    item.returnValues.iv = '';
                }

                return item;
            });
            return merge('mySessions', {sessions});
        case getStatus(ACTION_CLOSE_SESSION, STATUS_COMPLETE):
            data = {inProcessClose: false, closeId: null};
            return merge('mySessions', data);

        case getStatus(ACTION_GET_LOGIC_CONTRACT, STATUS_SUCCESS):
            data = {smartContractLogicAddress: action.data,};
            return merge('app', data);

        case getStatus(ACTION_GET_INVITE_PRICE, STATUS_START):
            return merge('invite', {inProcessReceivePrice: true});
        case getStatus(ACTION_GET_INVITE_PRICE, STATUS_FAIL):
            return merge('invite', {errorMessage: action.data});
        case getStatus(ACTION_GET_INVITE_PRICE, STATUS_SUCCESS):
            return merge('invite', {price: action.data.price, priceWeb: action.data.priceWeb,});
        case getStatus(ACTION_GET_INVITE_PRICE, STATUS_COMPLETE):
            return merge('invite', {inProcessReceivePrice: false});

        case getStatus(ACTION_ALLOW_APP, STATUS_SUCCESS):
            data = {transactionHash: action.data.transactionHash};
            return merge('sessionApp', data);
        case getStatus(ACTION_ALLOW_APP, STATUS_FAIL):
            data = {errorMessage: action.data.message};
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
        username: '',
        usernameHash: '',
        balance: {
            original: null,
            web: null,
        },
        wallet: {
            address: '',
            privateKey: '',
        }
    },
    sessionApp: {
        inProcess: false,
        errorMessage: ''
    },
    resetPasswordData: {
        inProcess: false,
        errorMessage: ''
    },
    settings: {
        inProcess: false,
        inviteReset: null
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
        smartContractAddress: '',
        smartContractLogicAddress: '',
        currency: ''
    },
    authorizeApp: {
        id: null,
        title: '',
        description: '',
        usernameHash: '',
        allowedUrls: [],
        isAppLoading: false,
        isSessionCreating: false,
        status: '',
        log: [],
        errorMessage: ''
    },
    invite: {
        inProcessCreation: false,
        inProcessReceiving: false,
        inProcessReceivePrice: false,
        status: '',
        log: [],
        invites: [],
        inviteInfo: {},
        errorMessage: '',
        createdInvites: [],
        info: {},
        price: null
    },
    myApps: {
        inProcessCreation: false,
        inProcessEditing: false,
        inProcessReceiving: false,
        status: '',
        errorMessage: '',
        log: [],
        apps: []
    },
    appsInfo: {
        inProcessReceiving: false,
        errorMessage: ''
    },
    mySessions: {
        inProcessReceiving: false,
        inProcessClose: false,
        closeId: null,
        errorMessage: '',
        sessions: []
    },
    trezorAddresses: {
        inProcessReceiving: false,
        errorMessage: '',
        addresses: [],
        publicKey: null
    },
    password: {
        inProcess: false,
        status: '',
        errorMessage: '',
        log: [],
    },
    config: getConfig(process.env.REACT_APP_NETWORK)
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
//export const ACTION_LOGOUT_APP = 'logout_app';
export const ACTION_SIGNUP = 'signup';
export const ACTION_INVITE = 'invite';
export const ACTION_SESSION = 'session';
export const ACTION_SELF_APP_INFO = 'self_app_info';
export const ACTION_APP_INFO = 'app_info';
export const ACTION_ALLOW_APP = 'allow_app';
export const ACTION_GET_SESSION_APP = 'get_session_app';
export const ACTION_GET_INVITES = 'get_invites';
export const ACTION_GET_INVITE = 'get_invite';
export const ACTION_CREATE_INVITE = 'create_invite';
export const ACTION_CHANGE_PASSWORD = 'change_password';
export const ACTION_GET_BALANCE = 'get_balance';
export const ACTION_GET_MY_APPS = 'get_my_apps';
export const ACTION_GET_MY_APPS_INFO = 'get_my_apps_info';
export const ACTION_CREATE_MY_APP = 'create_my_app';
export const ACTION_EDIT_MY_APP = 'edit_my_app';
export const ACTION_DELETE_MY_APP = 'delete_my_app';
export const ACTION_RESTORE_MY_APP = 'restore_my_app';
export const ACTION_GET_MY_SESSIONS = 'get_my_sessions';
export const ACTION_GET_TREZOR_ADDRESSES = 'get_trezor_addresses';
export const ACTION_GET_LOGIC_CONTRACT = 'get_logic_contract';
export const ACTION_GET_SETTINGS = 'get_settings';
export const ACTION_SET_INVITE_RESET = 'set_invite_reset';
export const ACTION_GET_INVITE_INFO = 'get_invite_info';
export const ACTION_RESET_PASSWORD = 'reset_password';
export const ACTION_CLOSE_SESSION = 'close_session';
export const ACTION_GET_INVITE_PRICE = 'get_invite_price';
