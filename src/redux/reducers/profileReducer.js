import {GET_PROFILE} from '../actions/profileAction';

const profileReducer = (state = {}, {type, payload}) => {
  switch (type) {
    case GET_PROFILE:
      return payload;
    default:
      return state;
  }
};
export default profileReducer;
