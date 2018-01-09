import { SIGN_IN, SIGN_OUT } from '../consts/ActionTypes';

const initialState = {
  currentUser: 'hello'
};

export default function authentication(state = initialState, action) {
  switch (action.type) {
  case SIGN_IN:
    return {
      currentUser: null
    };

  case SIGN_OUT:
    return {
      currentUser: null
    };

  default:
    return state;
  }
}
