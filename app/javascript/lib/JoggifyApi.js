import axios from 'axios';
import * as types from '../consts/ActionTypes';


export default function (dispatch, getState, catchError = true) {
  const { authentication } = getState();
  let settings = {};
  if (authentication.currentUser) {
    const { client, accessToken, uid } = authentication.currentUser;
    settings = Object.assign({}, settings, {
      headers: {
        'access-token': accessToken,
        client,
        uid
      }
    });
  }
  const instance = axios.create(settings);

  catchError && instance.interceptors.response.use(res => res, (err) => {
    dispatch({
      type: types.TOAST_DASH_MESSAGE,
      payload: err.toString()
    });
    return Promise.reject(err);
  });
  return instance;
}
