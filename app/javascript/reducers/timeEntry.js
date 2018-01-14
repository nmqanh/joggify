import {
  GET_TIME_ENTRIES,
  REMOVE_TIME_ENTRY,
  SET_LOADING_TIME_ENTRIES
} from '../consts/ActionTypes';

const initialState = {
  timeEntries: [],
  page: 0,
  hasMore: true,
  isLoading: false
};

export default function (state = initialState, action) {
  switch (action.type) {
  case SET_LOADING_TIME_ENTRIES:
  {
    return {
      ...state,
      isLoading: true
    };
  }

  case REMOVE_TIME_ENTRY:
  {
    return {
      ...state,
      timeEntries: state.timeEntries.filter(timeEntry =>
        timeEntry.id !== action.timeEntryId)
    };
  }

  case GET_TIME_ENTRIES:
  {
    const { page, timeEntries: nextTimeEntries } = action;
    const { timeEntries } = state;
    return {
      ...state,
      timeEntries: page < 2 ? nextTimeEntries : timeEntries.concat(nextTimeEntries),
      page,
      hasMore: page === 0 || nextTimeEntries.length > 0,
      isLoading: false
    };
  }

  default:
    return state;
  }
}
