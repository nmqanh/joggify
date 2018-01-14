import {
  GET_TIME_ENTRIES_REPORT_BY_WEEKS,
  SET_LOADING_TIME_ENTRIES_REPORT
} from '../consts/ActionTypes';

const initialState = {
  reportItems: [],
  isLoading: false
};

export default function (state = initialState, action) {
  switch (action.type) {
  case SET_LOADING_TIME_ENTRIES_REPORT:
  {
    return {
      ...state,
      isLoading: true
    };
  }
  case GET_TIME_ENTRIES_REPORT_BY_WEEKS:
  {
    return {
      ...state,
      reportItems: action.reportItems,
      isLoading: false
    };
  }

  default:
    return state;
  }
}
