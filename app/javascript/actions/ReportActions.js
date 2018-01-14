import JoggifyApi from '../lib/JoggifyApi';
import * as types from '../consts/ActionTypes';

export function getTimeEntriesByWeeksReport({ fromDate, toDate }) {
  return (dispatch, getState) => {
    dispatch({
      type: types.SET_LOADING_TIME_ENTRIES_REPORT
    });
    JoggifyApi(dispatch, getState)
      .get(Routes.time_entries_by_weeks_api_v1_reports_path({
        from_date: fromDate,
        to_date: toDate
      }))
      .then(({ data: reportItems }) => {
        dispatch({
          type: types.GET_TIME_ENTRIES_REPORT_BY_WEEKS,
          reportItems
        });
      });
  };
}

export function getTimeEntriesOverviewReport() {
  return {};
}
