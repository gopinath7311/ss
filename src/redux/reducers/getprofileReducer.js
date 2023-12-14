import {GET_PROFILE} from '../actions/allactions';

const getprofileReducer = (state = [], {type, payload}) => {
  switch (type) {
    case GET_PROFILE:
      return payload;
    default:
      return state;
  }
};
export default getprofileReducer;
