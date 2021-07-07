import { ACTION_TYPES } from './ActionType';

export const setTrending = (payload) => {
	// console.log("payload", payload);
	return {
		type: ACTION_TYPES.SET_TRENDING,
		payload
	};
};

export const setFSIdToGetDetails = (payload) => {
	// console.log('payload', payload);
	return {
		type: ACTION_TYPES.SET_FS_ID_GET_DETAILS,
		payload
	};
};

export const setMovieByFriend = (payload) => {
	// console.log('payload', payload);
	return {
		type: ACTION_TYPES.SET_MOVIE_BY_FRIENDS,
		payload
	};
};

export const setUserMobile = (payload) => {
	// console.log('payload', payload);
	return {
		type: ACTION_TYPES.SET_USER_MOBILE,
		payload
	};
};

export const setUserDetails = (payload) => {
	// console.log('payload', payload);
	return {
		type: ACTION_TYPES.SET_USER_DETAILS,
		payload
	};
};

export const setUserContactDict = (payload) => {
	// console.log('payload', payload);
	return {
		type: ACTION_TYPES.SET_USER_CONTACTS_DICT,
		payload
	};
};

export const setCountryCode = (payload) => {
	// console.log('payload', payload);
	return {
		type: ACTION_TYPES.SET_COUNTRY_CODE,
		payload
	};
};

export const setCountry = (payload) => {
	// console.log('payload', payload);
	return {
		type: ACTION_TYPES.SET_COUNTRY,
		payload
	};
};

export const setMovieDetails = (payload) => {
	// console.log('payload', payload);
	return {
		type: ACTION_TYPES.SET_MOVIE_DETAILS,
		payload
	};
};

export const setUtilData = (payload) => {
	// console.log('payload', payload);
	return {
		type: ACTION_TYPES.SET_UTIL_DATA,
		payload
	};
};
