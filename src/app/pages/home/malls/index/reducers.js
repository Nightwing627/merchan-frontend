import { fromJS } from "immutable";
import { SET_MALLS, SET_PARTNERS } from "./constants";

const initialState = fromJS({
  malls: [],
  partners: [],
});

function mallsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_MALLS:
      return state.set("malls", action.malls);
    case SET_PARTNERS:
      return state.set("partners", action.partners);
    default:
      return state;
  }
}

export default mallsReducer;
