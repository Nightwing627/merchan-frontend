import { createSelector } from "reselect";

const selectUsersDomain = (state) => state.usersReducer;
const makeSelectUsersPageState = () =>
  createSelector(selectUsersDomain, (substate) =>
    substate ? substate.toJS() : {}
  );
const makeSelectUsers = () =>
  createSelector(makeSelectUsersPageState(), (substate) => substate.users);

export default selectUsersDomain;
export { makeSelectUsersPageState, makeSelectUsers };
