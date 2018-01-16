import JoggifyApi from '../lib/JoggifyApi';
import * as types from '../consts/ActionTypes';

export function removeTimeEntry(timeEntryId) {
  return (dispatch, getState) => {
    JoggifyApi(dispatch, getState)
      .delete(Routes.api_v1_time_entry_path(timeEntryId))
      .then(() => {
        dispatch({
          type: types.REMOVE_TIME_ENTRY,
          timeEntryId
        });
      });
  };
}

export function resetTimeEntries() {
  return {
    type: types.GET_TIME_ENTRIES,
    timeEntries: [],
    page: 0
  };
}

export function getTimeEntries({
  page,
  fromDate,
  toDate,
  isDateAscending,
  userId
}) {
  return (dispatch, getState) => {
    dispatch({
      type: types.SET_LOADING_TIME_ENTRIES
    });
    JoggifyApi(dispatch, getState)
      .get(Routes.api_v1_time_entries_path({
        page,
        from_date: fromDate,
        to_date: toDate,
        is_date_ascending: isDateAscending,
        user_id: userId
      }))
      .then(({ data: timeEntries }) => {
        dispatch({
          type: types.GET_TIME_ENTRIES,
          timeEntries,
          page
        });
      });
  };
}

export function addTimeEntry(timeEntry) {
  return (dispatch, getState) => (
    JoggifyApi(dispatch, getState)
      .post(Routes.api_v1_time_entries_path({
        date: timeEntry.date,
        distance_in_kilometres: timeEntry.distanceInKilometres,
        duration_in_minutes: timeEntry.durationInMinutes,
        user_id: timeEntry.userId
      }))
      .then(() => {
        dispatch({
          type: types.TOAST_DASH_MESSAGE,
          payload: 'New time entry successfully added!'
        });
      })
  );
}

export function editTimeEntry(timeEntry) {
  return (dispatch, getState) => (
    JoggifyApi(dispatch, getState)
      .patch(Routes.api_v1_time_entry_path(timeEntry.id, {
        date: timeEntry.date,
        distance_in_kilometres: timeEntry.distanceInKilometres,
        duration_in_minutes: timeEntry.durationInMinutes
      }))
      .then(() => {
        dispatch({
          type: types.TOAST_DASH_MESSAGE,
          payload: 'Edit successfully!'
        });
      })
  );
}
