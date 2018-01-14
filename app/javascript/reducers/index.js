import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import authentication from './authentication';
import toast from './toast';
import timeEntry from './timeEntry';
import report from './report';

const rootReducer = combineReducers({
  authentication,
  toast,
  timeEntry,
  form,
  report
});

export default rootReducer;
