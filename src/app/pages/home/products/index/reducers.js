import { fromJS } from "immutable";
import { SET_PRODUCTS } from "./constants";

const initialState = fromJS({
  products: [],
});

function productsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PRODUCTS:
      return state.set("products", action.products);
    default:
      return state;
  }
}

export default productsReducer;
