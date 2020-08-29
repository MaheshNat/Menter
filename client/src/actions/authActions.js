import axios from 'axios';
import { returnErrors } from './errorAction';

export const loadUser = () => {
  return (dispatch, getState) => {
    dispatch({ type: 'USER_LOADING' });
    axios
      .get('auth/user', tokenConfig(getState))
      .then((res) => {
        dispatch({ type: 'USER_LOADED', payload: res.data });
      })
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({ type: 'AUTH_ERROR' });
      });
  };
};

export const registerUser = (name, email, password) => {
  return (dispatch) => {
    const config = { headers: { 'Content-type': 'application/json' } };
    const body = JSON.stringify({ name, email, password });
    axios
      .post('auth/register', body, config)
      .then((res) => {
        dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
      })
      .catch((err) => {
        dispatch(
          returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL')
        );
        dispatch({ type: 'REGISTER_FAIL' });
      });
  };
};

export const loginUser = (email, password) => {
  return (dispatch) => {
    const config = { headers: { 'Content-type': 'application/json' } };
    const body = JSON.stringify({ email, password });
    axios
      .post('auth/login', body, config)
      .then((res) => {
        dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      })
      .catch((err) => {
        dispatch(
          returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL')
        );
        dispatch({ type: 'LOGIN_FAIL' });
      });
  };
};

export const logout = () => {
  return { type: 'LOGOUT' };
};

export const tokenConfig = (getState) => {
  const token = getState().auth.token;
  const config = { headers: { 'Content-type': 'application/json' } };
  if (token) config.headers['x-auth-token'] = token;
  return config;
};
