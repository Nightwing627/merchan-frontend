import { all } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as auth from "./ducks/auth.duck";
import { metronic } from "../../_metronic";
import usersReducer from "../pages/home/users/index/reducers";
import mallsReducer from "../pages/home/malls/index/reducers";
import productsReducer from "../pages/home/products/index/reducers";

export const rootReducer = combineReducers({
  auth: auth.reducer,
  i18n: metronic.i18n.reducer,
  builder: metronic.builder.reducer,
  usersReducer,
  mallsReducer,
  productsReducer,
});

export function* rootSaga() {
  yield all([auth.saga()]);
}
