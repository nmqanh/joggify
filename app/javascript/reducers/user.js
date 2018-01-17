import {
  GET_USERS,
  REMOVE_USER,
  SET_LOADING_USERS
} from '../consts/ActionTypes';

const initialState = {
  users: [],
  page: 0,
  total: 0,
  perPage: 0,
  isLoading: false
};

export default function (state = initialState, action) {
  switch (action.type) {
  case SET_LOADING_USERS:
  {
    return {
      ...state,
      isLoading: true
    };
  }
  case REMOVE_USER:
  {
    return {
      ...state,
      users: state.users.filter(user =>
        user.id !== action.userId)
    };
  }

  case GET_USERS:
  {
    const {
      page,
      users,
      total,
      perPage
    } = action;

    return {
      ...state,
      users,
      page,
      total,
      perPage,
      isLoading: false
    };
  }

  default:
    return state;
  }
}
