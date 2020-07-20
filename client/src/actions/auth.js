import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_FAIL, LOGIN_SUCCESS, LOG_OUT } from './types';
import { setAlert } from './alert';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
export const loadUser = () => async dispatch => {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            setAuthToken(token);
            const res = await axios('api/auth');
            dispatch({
                type: USER_LOADED,
                payload: res.data
            })
        } catch (err) {
            console.log(err)
            dispatch({
                type: AUTH_ERROR
            })
        }
    }
}

export const register = ({ name, email, password }) => async dispatch => {
    const newUser = {
        name,
        email,
        password
    }
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify(newUser)
    try {
        const res = await axios.post('api/users', body, config)
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })
        dispatch(setAlert('User is successfully registered', 'success'))
        dispatch(loadUser())
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors > 0) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: REGISTER_FAIL,
        })
    }
}

export const login = ({ email, password }) => async dispatch => {
    const user = {
        email,
        password
    }
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify(user)
    try {
        const res = await axios.post('api/users/login', body, config)
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser())
    } catch (err) {
        const errors = err.response.data.errors;
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        dispatch({
            type: LOGIN_FAIL,
        })
    }
}

export const logout = () => dispatch => {
    dispatch({
        type: LOG_OUT
    })
}