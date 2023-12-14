import {GET_TICKETS} from '../actions/getticketsAction';

const GetticketsReducer = (state = [], {type, payload}) => {
  switch (type) {
    case GET_TICKETS:
      return payload;
    default:
      return state;
  }
};
export default GetticketsReducer;
