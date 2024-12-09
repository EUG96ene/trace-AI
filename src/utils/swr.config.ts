import { cache } from 'swr/_internal';
import {axiosClient} from './axios';
// import Constants from './constants';

export default function getSWRConfig(user: { auth_token: any; }) {
  return {
    fetcher: (url: string) => {
      const axios = axiosClient(user);
      return axios.get(url).then((res) => res.data);
    },
    errorRetryCount: 1,
    errorRetryInterval: 15000,
    // refreshInterval: Constants.DATA_REFRESH_INTERVAL, // query after every minute for new data
    cache
  };
}