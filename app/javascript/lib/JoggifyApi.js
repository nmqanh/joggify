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

  instance.interceptors.response.use((res) => {
    if (res.headers['access-token'] && authentication.currentUser) {
      const currentUser = Object.assign(authentication.currentUser, {
        accessToken: res.headers['access-token'],
        client: res.headers.client,
        uid: res.headers.uid
      });

      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      dispatch({
        type: types.ACCOUNT_UPDATED,
        currentUser
      });
    }
    return Promise.resolve(res);
  }, (err) => {
    if (catchError) {
      let fullMessages;
      try {
        fullMessages = err.response.data.errors.full_messages;
        fullMessages = fullMessages.filter((item, pos) => (
          fullMessages.indexOf(item) === pos
        ));
        fullMessages = fullMessages.join('\n');
      } catch (ex) {
        fullMessages = null;
      }

      dispatch({
        type: types.TOAST_DASH_MESSAGE,
        payload: fullMessages || err.toString()
      });
    }
    return Promise.reject(err);
  });
  return instance;
}
