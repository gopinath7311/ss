import {GET_PROFITHIS} from '../actions/getprofithistoryActions';

const getprofithisReducer = (state = [], {type, payload}) => {
  switch (type) {
    case GET_PROFITHIS:
      return payload;
    default:
      return state;
  }
};
export default getprofithisReducer;
