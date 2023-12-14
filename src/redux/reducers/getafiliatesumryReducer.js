import {GET_REFERRALSUMRY} from '../actions/getafiliatesummaryAction';

const getreferalsumryReducer = (state = [], {type, payload}) => {
  switch (type) {
    case GET_REFERRALSUMRY:
      return payload;
    default:
      return state;
  }
};
export default getreferalsumryReducer;
