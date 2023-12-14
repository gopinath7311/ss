import {DARKMODE_THEME} from '../actions/darkmodeActions';

const themeReducer = (state = [], {type, payload}) => {
  switch (type) {
    case DARKMODE_THEME:
      return payload;
    default:
      return state;
  }
};
export default themeReducer;
