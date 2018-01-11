import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authentication from './authentication';
import toast from './toast';

const rootReducer = combineReducers({
  authentication,
  toast,
  form: formReducer
});

export default rootReducer;
