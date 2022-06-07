import { SET_PRODUCTS } from "./constants";

export function setProducts(products) {
  return {
    type: SET_PRODUCTS,
    products,
  };
}
