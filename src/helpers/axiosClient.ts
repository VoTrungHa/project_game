// #region Global Imports
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { logoutUser } from 'containers/Auth/duck/thunks';
import storage from 'helpers/localStorage';
import i18n from 'locales';
import { store } from 'store';

const configs: AxiosRequestConfig = {
  baseURL: process.env.API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Accept-Language': i18n.language,
  },
  timeout: 60000,
};

const axiosClient: AxiosInstance = axios.create(configs);
axiosClient.interceptors.request.use((request: AxiosRequestConfig) => {
  request.headers['Accept-Language'] = i18n.language;
  const authorization = storage.getAccessToken();
  if (authorization) {
    request.headers.Authorization = `Bearer ${authorization}`;
  }

  return request;
});

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if ([200, 201].includes(response.status) && response.data) {
      return response.data;
    }
    return Promise.reject(response.statusText || '');
  },
  (error) => {
    const { status } = error.response;
    // TODO: handle 414 later
    if (status === 414) {
      storage.removeAccessToken();
      storage.removeRefreshToken();
      storage.removeLanguage();
    }
    if (status === 401 && storage.getAccessToken()) {
      store.dispatch(logoutUser() as any);
    }
    return Promise.reject(error);
  },
);
export { configs };
export default axiosClient;
