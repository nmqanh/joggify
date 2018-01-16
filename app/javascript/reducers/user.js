import {
  GET_USERS,
  REMOVE_USER,
  SET_LOADING_USERS
} from '../consts/ActionTypes';

const initialState = {
  users: [],
  page: 0,
  hasMore: true,
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
      users: state.users.filter(timeEntry =>
        timeEntry.id !== action.timeEntryId)
    };
  }

  case GET_USERS:
  {
    const { page, users: nextUsers } = action;
    const { users } = state;
    return {
      ...state,
      users: page < 2 ? nextUsers : users.concat(nextUsers),
      page,
      hasMore: page === 0 || nextUsers.length > 0,
      isLoading: false
    };
  }

  default:
    return state;
  }
}
