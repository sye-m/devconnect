import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOG_OUT } from '../actions/types'

const initialState = {
    token: null,
    isAuthenticated: false,
    loading: true,
    user: null
};
export default function auth(state = initialState, action) {
    const { payload, type } = action;
    switch (type) {
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload
            }
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', payload.token)
            return {
                ...state,
                ...payload,
                loading: false,
                isAuthenticated: true
            };
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOG_OUT:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                loading: false,
                isAuthenticated: false
            };
        default:
            return state;
    }
}