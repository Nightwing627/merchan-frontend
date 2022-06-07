import { SET_MALLS, SET_PARTNERS } from "./constants";

export function setMalls(malls) {
  return {
    type: SET_MALLS,
    malls,
  };
}

export function setPartners(partners) {
  return {
    type: SET_PARTNERS,
    partners,
  };
}
