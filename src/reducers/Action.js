import { ACTION_TYPES } from './ActionType';

export const setTrendingTodayX = (payload) => {
	// console.log("payload", payload);
	return {
		type: ACTION_TYPES.SET_TRENDING_TODAY,
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

export const setDataFor = (payload) => {
	// console.log('payload', payload);
	return {
		type: ACTION_TYPES.SET_DATA_FOR,
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
