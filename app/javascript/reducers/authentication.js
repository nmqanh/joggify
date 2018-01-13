import { SIGN_IN, SIGN_OUT, ACCOUNT_UPDATED } from '../consts/ActionTypes';

const offlineCurrentUser = localStorage.getItem('currentUser');
const initialState = {
  currentUser: offlineCurrentUser ? JSON.parse(offlineCurrentUser) : null
};

export default function (state = initialState, action) {
  switch (action.type) {
  case SIGN_IN:
    return {
      currentUser: action.currentUser
    };

  case SIGN_OUT: {
    localStorage.removeItem('currentUser');
    return {
      currentUser: null
    };
  }

  case ACCOUNT_UPDATED: {
    const nextCurrentUser = Object.assign(state.currentUser, action.currentUser);
    localStorage.setItem('currentUser', JSON.stringify(nextCurrentUser));
    return {
      currentUser: nextCurrentUser
    };
  }

  default:
    return state;
  }
}
