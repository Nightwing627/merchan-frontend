import { fromJS } from "immutable";
import { SET_USERS } from "./constants";

const initialState = fromJS({
  users: [],
});

function usersReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USERS:
      return state.set("users", action.users);
    default:
      return state;
  }
}

export default usersReducer;
