import { ACTION_TYPES } from "./ActionType";

const initialState = {
  trendingToday: [],
  trendingCurrentWeek: [],
  tmdbIdToGetDetails: null,
  userDetails: {},
};
const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_TRENDING_TODAY:
      // // console.log("SET_RESTAURANT_DETAILS");
      return {
        ...state,
        trendingToday: action.payload,
      };

    case ACTION_TYPES.SET_DATA_FOR:
      // // console.log("SET_RESTAURANT_DETAILS");
      return {
        ...state,
        trendingCurrentWeek: action.payload,
      };

    case ACTION_TYPES.SET_TMBD_ID_GET_DETAILS:
      // // console.log("SET_RESTAURANT_DETAILS");
      return {
        ...state,
        tmdbIdToGetDetails: action.payload,
      };

    default:
      // console.log("Default");
      return state;
  }
};
export default AppReducer;
