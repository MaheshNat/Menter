import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import invitationReducer from './invitationReducer';

export default combineReducers({
  error: errorReducer,
  auth: authReducer,
  invitation: invitationReducer,
});
