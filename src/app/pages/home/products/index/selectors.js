import { createSelector } from "reselect";

const selectProductsDomain = (state) => state.productsReducer;
const makeSelectProductsPageState = () =>
  createSelector(selectProductsDomain, (substate) =>
    substate ? substate.toJS() : {}
  );
const makeSelectProducts = () =>
  createSelector(makeSelectProductsPageState(), (substate) => substate.products);

export default selectProductsDomain;
export { makeSelectProductsPageState, makeSelectProducts };
