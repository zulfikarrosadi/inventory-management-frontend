import { useEffect } from 'react';
import axios from '../axios';
import useRefreshToken from './useRefreshToken';

function useAxios() {
  const refresh = useRefreshToken();

  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      function (config) {
        return config;
      },
      async function (error) {
        if (
          error.response &&
          error.response.status === 401 &&
          !error.config.sent
        ) {
          error.config.sent = true;
          try {
            await refresh();
            return axios.request(error.config);
          } catch (error) {
            console.log('respose_interceptor', error);
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return axios;
}

export default useAxios;
