import { UPDATE_ADMINTXES } from "../actions/allactions";

const detailsReducer = (state = {}, {type, payload}) => {
  
  switch (type) {
    case UPDATE_ADMINTXES:
      return payload;
    default:
      return state;
  }
};
export default detailsReducer;
