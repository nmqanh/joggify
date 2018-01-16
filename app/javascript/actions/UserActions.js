import JoggifyApi from '../lib/JoggifyApi';
import * as types from '../consts/ActionTypes';

export function removeUser(userId) {
  return (dispatch, getState) => {
    JoggifyApi(dispatch, getState)
      .delete(Routes.api_v1_user_path(userId))
      .then(() => {
        dispatch({
          type: types.REMOVE_USER,
          userId
        });
      });
  };
}

export function resetUsers() {
  return {
    type: types.GET_USERS,
    users: [],
    page: 0
  };
}

export function getUsers({
  page
}) {
  return (dispatch, getState) => {
    dispatch({
      type: types.SET_LOADING_USERS
    });
    JoggifyApi(dispatch, getState)
      .get(Routes.api_v1_users_path({
        page
      }))
      .then(({ data: users }) => {
        dispatch({
          type: types.GET_USERS,
          users,
          page
        });
      });
  };
}

export function addUser(user) {
  return (dispatch, getState) => {
    JoggifyApi(dispatch, getState)
      .post(Routes.api_v1_users_path({
        role: user.role,
        email: user.email,
        name: user.name,
        password: user.password,
        timezone: user.timezone
      }))
      .then(() => {
        getUsers({ page: 1 })(dispatch, getState);
        dispatch({
          type: types.TOAST_DASH_MESSAGE,
          payload: 'New user added'
        });
      });
  };
}

export function editUser(user) {
  return (dispatch, getState) => {
    JoggifyApi(dispatch, getState)
      .patch(Routes.api_v1_user_path(user.id, {
        role: user.role,
        email: user.email,
        name: user.name,
        password: user.password,
        timezone: user.timezone
      }))
      .then(() => {
        getUsers({ page: 1 })(dispatch, getState);
        dispatch({
          type: types.TOAST_DASH_MESSAGE,
          payload: 'Edit successfully!'
        });
      });
  };
}

export function searchUsers(query) {
  return (dispatch, getState) => (
    JoggifyApi(dispatch, getState)
      .get(Routes.api_v1_users_path({
        query,
        page: 1
      }))
  );
}
