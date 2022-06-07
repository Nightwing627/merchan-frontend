import { createSelector } from "reselect";

const selectMallsDomain = (state) => state.mallsReducer;
const makeSelectMallsPageState = () =>
  createSelector(selectMallsDomain, (substate) =>
    substate ? substate.toJS() : {}
  );
const makeSelectMalls = () =>
  createSelector(makeSelectMallsPageState(), (substate) => substate.malls);
const makeSelectPartners = () =>
  createSelector(makeSelectMallsPageState(), (substate) => substate.partners);

export default selectMallsDomain;
export { makeSelectMallsPageState, makeSelectMalls, makeSelectPartners };
