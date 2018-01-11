import { TOAST_DASH_MESSAGE, TOAST_DASH_CLEAR } from '../consts/ActionTypes';

const initialState = {
  dash: {
    message: '',
    open: false
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
  case TOAST_DASH_MESSAGE:
  {
    return {
      ...state,
      dash: {
        message: action.payload,
        open: true
      }
    };
  }

  case TOAST_DASH_CLEAR:
  {
    return {
      ...state,
      dash: {
        message: '',
        open: false
      }
    };
  }
  default:
    return state;
  }
}
