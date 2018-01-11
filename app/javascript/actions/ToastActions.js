import * as types from '../consts/ActionTypes';

export function addToasterMessage(message) {
  return {
    type: types.TOAST_DASH_MESSAGE,
    payload: message
  };
}
export function clearToaster() {
  return {
    type: types.TOAST_DASH_CLEAR
  };
}
