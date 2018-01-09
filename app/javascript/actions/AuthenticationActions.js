import * as types from '../consts/ActionTypes';

export function signIn(username, password) {
  return {
    type: types.SIGN_IN,
    username,
    password
  };
}

export function signOut() {
  return {
    type: types.SIGN_OUT
  };
}
