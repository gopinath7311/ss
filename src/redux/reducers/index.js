import {combineReducers} from 'redux';
import authReducer from './authReducer';
import profileReducer from './profileReducer';
import themeReducer from './darkmodeReducers';
import getprofileReducer from './getprofileReducer';
import GetticketsReducer from './getticketsReducer';
import getprofithisReducer from './getprofithisReducer';
import getreferalhisReducer from './getaffiliatehisReducer';
import gettranshisReducer from './gettranshisReducer';
import admintxesReducer from './admintaxReducer';
import getreferalsumryReducer from './getafiliatesumryReducer';
import detailsReducer from './DetailsReducer';

export default function allReducers() {
  return combineReducers({
    auth: authReducer,
    getprofile: profileReducer,
    theme: themeReducer,
    getprofil: getprofileReducer,
    gettickets: GetticketsReducer,
    getprfithis: getprofithisReducer,
    getrefrlhis: getreferalhisReducer,
    gettranshis: gettranshisReducer,
    gettaxes: admintxesReducer,
    getrefsumry: getreferalsumryReducer,
    details:detailsReducer
  });
}
