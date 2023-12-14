import {GET_HISTORY} from '../actions/gethistoryAction';

const gethistoryReducer = (state = [], {type, payload}) => {
  switch (type) {
    case GET_HISTORY:
      return payload;
    default:
      return state;
  }
};
export default gethistoryReducer;
