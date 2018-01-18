import qs from 'query-string';
import JoggifyApi from '../lib/JoggifyApi';
import * as types from '../consts/ActionTypes';


function setTokenToUser(response) {
  const currentUser = Object.assign(response.data.data, {
    accessToken: response.headers['access-token'],
    client: response.headers.client,
    uid: response.headers.uid
  });
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  return currentUser;
}

export function validateToken() {
  return (dispatch, getState) => {
    JoggifyApi(dispatch, getState, false)
      .get(Routes.api_v1_auth_validate_token_path())
      .then((response) => {
        dispatch({
          type: types.ACCOUNT_UPDATED,
          currentUser: response.data.data
        });
      })
      .catch(() => {
        dispatch({ type: types.SIGN_OUT });
      });
  };
}

export function signIn({ email, password }) {
  return (dispatch, getState) => {
    JoggifyApi(dispatch, getState, false)
      .post(Routes.user_session_path(), {
        email,
        password
      })
      .then((response) => {
        const currentUser = setTokenToUser(response);
        dispatch({
          type: types.SIGN_IN,
          currentUser
        });
        dispatch({
          type: types.TOAST_DASH_MESSAGE,
          payload: 'Signed in successfully.'
        });
      })
      .catch(() => {
        dispatch({
          type: types.TOAST_DASH_MESSAGE,
          payload: 'Failed to sign in: Wrong email or password.'
        });
      });
  };
}

export function forgetPassword({ email }) {
  return (dispatch, getState) => (
    JoggifyApi(dispatch, getState)
      .post(Routes.api_v1_auth_password_reset_path(), {
        email
      })
      .then(() => {
        dispatch({
          type: types.TOAST_DASH_MESSAGE,
          payload: 'An email has been sent to help reset password.'
        });
      })
  );
}

export function resetPassword({ password }) {
  return (dispatch, getState) => (
    JoggifyApi(dispatch, getState)
      .patch(Routes.user_password_path(), {
        password,
        reset_password_token: qs.parse(window.location.search).reset_password_token
      })
      .then(() => {
        dispatch({
          type: types.TOAST_DASH_MESSAGE,
          payload: 'New password was set successfully. Please sign in!'
        });
      })
  );
}

export function signUp({
  email, name, password, timezoneOffset
}) {
  return (dispatch, getState) => (
    JoggifyApi(dispatch, getState)
      .post(Routes.user_registration_path(), {
        email,
        password,
        name,
        timezone_offset: timezoneOffset
      })
      .then((response) => {
        const currentUser = setTokenToUser(response);
        dispatch({
          type: types.SIGN_IN,
          currentUser
        });
        dispatch({
          type: types.TOAST_DASH_MESSAGE,
          payload: 'Signed in successfully.'
        });
      })
  );
}

export function updateAccount({
  email, name, password, timezone
}) {
  return (dispatch, getState) => {
    JoggifyApi(dispatch, getState)
      .patch(Routes.user_registration_path(), {
        email,
        password,
        name,
        timezone
      })
      .then((response) => {
        dispatch({
          type: types.ACCOUNT_UPDATED,
          currentUser: response.data.data
        });
        dispatch({
          type: types.TOAST_DASH_MESSAGE,
          payload: 'Account updated successfully.'
        });
      });
  };
}

export function signOut() {
  return (dispatch, getState) => {
    JoggifyApi(dispatch, getState, false)
      .delete(Routes.destroy_user_session_path())
      .then(() => {
        dispatch({ type: types.SIGN_OUT });
      }).catch(() => {
        dispatch({ type: types.SIGN_OUT });
      });
  };
}
