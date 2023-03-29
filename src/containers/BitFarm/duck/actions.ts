import * as types from './types';

export const getChickenFarmStatsRequested = () => ({
  type: types.GET_CHICKEN_FARM_STATS_REQUESTED,
});

export const getChickenFarmStatsSuccess = (payload) => ({
  type: types.GET_CHICKEN_FARM_STATS_SUCCESS,
  payload,
});

export const getChickenFarmStatsFailed = () => ({
  type: types.GET_CHICKEN_FARM_STATS_FAILED,
});

export const getAdultStatsRequested = () => ({
  type: types.GET_ADULT_STATS_REQUESTED,
});

export const getAdultStatsSuccess = (payload) => ({
  type: types.GET_ADULT_STATS_SUCCESS,
  payload,
});

export const getAdultStatsFailed = () => ({
  type: types.GET_ADULT_STATS_FAILED,
});
