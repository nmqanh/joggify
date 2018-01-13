import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import authentication from './authentication';
import toast from './toast';
import timeEntry from './timeEntry';

const rootReducer = combineReducers({
  authentication,
  toast,
  timeEntry,
  form
});

export default rootReducer;
