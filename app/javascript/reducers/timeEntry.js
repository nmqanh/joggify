import {
  GET_TIME_ENTRIES,
  REMOVE_TIME_ENTRY
} from '../consts/ActionTypes';

const initialState = {
  timeEntries: [],
  page: 0,
  hasMore: true
};

export default function (state = initialState, action) {
  switch (action.type) {
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
      timeEntries: page === 1 ? nextTimeEntries : timeEntries.concat(nextTimeEntries),
      page,
      hasMore: nextTimeEntries.length > 0
    };
  }

  default:
    return state;
  }
}
