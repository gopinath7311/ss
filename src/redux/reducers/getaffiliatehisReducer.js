import {GET_REFERRALHIS} from '../actions/getaffiliatehistoryAction';

const getreferalhisReducer = (state = [], {type, payload}) => {
  switch (type) {
    case GET_REFERRALHIS:
      return payload;
    default:
      return state;
  }
};
export default getreferalhisReducer;
