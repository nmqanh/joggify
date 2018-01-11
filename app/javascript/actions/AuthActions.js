import JoggifyApi from '../lib/JoggifyApi';
import * as types from '../consts/ActionTypes';


export function signIn(email, password) {
  return (dispatch, getState) => {
    JoggifyApi(dispatch, getState, false)
      .post(Routes.user_session_path(), {
        email,
        password
      })
      .then((response) => {
        const currentUser = Object.assign({}, response.data.data, {
          accessToken: response.headers['access-token'],
          client: response.headers.client
        });

        localStorage.setItem('currentUser', JSON.stringify(currentUser));

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

export function signOut() {
  return (dispatch) => {
    localStorage.removeItem('currentUser');
    dispatch({ type: types.SIGN_OUT });
  };
}
