import { ACTION_TYPES } from './ActionType';

const initialState = {
	trendingToday: [],
	trendingCurrentWeek: [],
	fsIdToGetDetails: null,
	userDetails: null,
	userMobile: null,
	userContactDict: null,
	countryCode: null,
	country: null,
	movieDetails: null
};
const AppReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPES.SET_TRENDING_TODAY:
			// // console.log("SET_RESTAURANT_DETAILS");
			return {
				...state,
				trendingToday: action.payload
			};

		case ACTION_TYPES.SET_DATA_FOR:
			// // console.log("SET_RESTAURANT_DETAILS");
			return {
				...state,
				trendingCurrentWeek: action.payload
			};

		case ACTION_TYPES.SET_FS_ID_GET_DETAILS:
			// // console.log("SET_RESTAURANT_DETAILS");
			return {
				...state,
				fsIdToGetDetails: action.payload
			};

		case ACTION_TYPES.SET_USER_MOBILE:
			// console.log('SET_USER_MOBILE');
			return {
				...state,
				userMobile: action.payload
			};

		case ACTION_TYPES.SET_USER_DETAILS:
			// // console.log("SET_RESTAURANT_DETAILS");
			return {
				...state,
				userDetails: action.payload
			};
		case ACTION_TYPES.SET_USER_CONTACTS_DICT:
			// // console.log("SET_RESTAURANT_DETAILS");
			return {
				...state,
				userContactDict: action.payload
			};

		case ACTION_TYPES.SET_COUNTRY_CODE:
			// // console.log("SET_COUNTRY_CODE");
			return {
				...state,
				countryCode: action.payload
			};

		case ACTION_TYPES.SET_COUNTRY:
			// // console.log("SET_COUNTRY");
			return {
				...state,
				country: action.payload
			};
		case ACTION_TYPES.SET_MOVIE_DETAILS:
			// // console.log("SET_MOVIE_DETAILS");
			return {
				...state,
				movieDetails: action.payload
			};

		default:
			// console.log("Default");
			return state;
	}
};
export default AppReducer;
