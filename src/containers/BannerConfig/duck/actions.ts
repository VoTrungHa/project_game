import * as types from './types';

export const getBannerConfigRequested = () => ({
  type: types.GET_BANNER_CONFIG_REQUESTED,
});

export const getBannerConfigSuccess = (payload: IGetBannerConfigResponse) => ({
  type: types.GET_BANNER_CONFIG_SUCCESS,
  payload,
});

export const getBannerConfigFailed = () => ({
  type: types.GET_BANNER_CONFIG_FAILED,
});
