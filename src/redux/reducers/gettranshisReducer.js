import {GET_TRANSACTNHIS} from '../actions/gettranshistoryAction';

const gettranshisReducer = (state = [], {type, payload}) => {
  switch (type) {
    case GET_TRANSACTNHIS:
      return payload;
    default:
      return state;
  }
};
export default gettranshisReducer;
