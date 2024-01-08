import { GET_PROFILEDET } from "../actions/profileAction";

const profileReducer = (state = {}, {type, payload}) => {
  switch (type) {
    case GET_PROFILEDET:
      return payload;
    default:
      return state;
  }
};
export default profileReducer;
