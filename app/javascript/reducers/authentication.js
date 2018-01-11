import { SIGN_IN, SIGN_OUT } from '../consts/ActionTypes';

const offlineCurrentUser = localStorage.getItem('currentUser');
const initialState = {
  currentUser: offlineCurrentUser ? JSON.parse(offlineCurrentUser) : null
};

export default function authentication(state = initialState, action) {
  switch (action.type) {
  case SIGN_IN:
    return {
      currentUser: action.currentUser
    };

  case SIGN_OUT:
    return {
      currentUser: null
    };

  default:
    return state;
  }
}
