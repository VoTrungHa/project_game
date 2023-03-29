import * as types from './types';

export const getHomePageBannerConfigRequested = () => ({
  type: types.GET_HOMEPAGE_BANNER_CONFIG_REQUESTED,
});

export const getHomePageBannerConfigSuccess = (payload: IGetHomePageConfig) => ({
  type: types.GET_HOMEPAGE_BANNER_CONFIG_SUCCESS,
  payload,
});

export const getHomePageBannerConfigFailed = () => ({
  type: types.GET_HOMEPAGE_BANNER_CONFIG_FAILED,
});
