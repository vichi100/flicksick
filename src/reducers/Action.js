import { ACTION_TYPES } from './ActionType';

export const setTrendingTodayX = (payload) => {
	// console.log("payload", payload);
	return {
		type: ACTION_TYPES.SET_TRENDING_TODAY,
		payload
	};
};

export const setTMDBIdToGetDetails = (payload) => {
	console.log('payload', payload);
	return {
		type: ACTION_TYPES.SET_TMBD_ID_GET_DETAILS,
		payload
	};
};

export const setDataFor = (payload) => {
	console.log('payload', payload);
	return {
		type: ACTION_TYPES.SET_DATA_FOR,
		payload
	};
};

export const setUserMobile = (payload) => {
	console.log('payload', payload);
	return {
		type: ACTION_TYPES.SET_USER_MOBILE,
		payload
	};
};

export const setUserDetails = (payload) => {
	console.log('payload', payload);
	return {
		type: ACTION_TYPES.SET_USER_DETAILS,
		payload
	};
};
