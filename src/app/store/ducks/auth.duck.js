import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  call,
  put,
  takeLatest,
} from "redux-saga/effects";
// eslint-disable-next-line no-unused-vars
import { getUserByTokenApi } from "../../crud/auth.crud";
import * as routerHelpers from "../../router/RouterHelpers";

export const actionTypes = {
  Login: "[Login] Action",
  Logout: "[Logout] Action",
  Register: "[Register] Action",
  UserRequested: "[Request User] Action",
  UserLoaded: "[Load User] Auth API",
};

const initialAuthState = {
  user: undefined,
  authToken: undefined,
};

export const reducer = persistReducer(
  { storage, key: "demo2-auth", whitelist: ["user", "authToken"] },
  (state = initialAuthState, action) => {
    switch (action.type) {
      case actionTypes.Login: {
        const { authToken } = action.payload;

        return { authToken, user: undefined };
      }

      case actionTypes.Register: {
        const { authToken } = action.payload;

        return { authToken, user: undefined };
      }

      case actionTypes.Logout: {
        routerHelpers.forgotLastLocation();
        return initialAuthState;
      }

      case actionTypes.UserLoaded: {
        const { user } = action.payload;

        return { ...state, user };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  login: (authToken) => ({ type: actionTypes.Login, payload: { authToken } }),
  register: (authToken) => ({
    type: actionTypes.Register,
    payload: { authToken },
  }),
  logout: () => ({ type: actionTypes.Logout }),
  requestUser: (authToken) => ({
    type: actionTypes.UserRequested,
    payload: authToken,
  }),
  fulfillUser: (user) => ({ type: actionTypes.UserLoaded, payload: { user } }),
};

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga(action) {
    yield put(actions.requestUser(action.payload));
  });

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.UserRequested, function* userRequested(action) {
    const originUser = yield call(getUserByTokenApi, action.payload);
    const {
      email,
      id,
      phoneNumber,
      profileImage,
      userType,
      username,
    } = originUser
    const user = {
      id,
      username,
      email,
      accessToken: "access-token-8f3ae836da744329a6f93bf20594b5cc",
      refreshToken: "access-token-f8c137a2c98743f48b643e71161d90aa",
      fullname: username,
      phoneNumber,
      profileImage,
      userType,
    };
    yield put(actions.fulfillUser(user));
  });
}
