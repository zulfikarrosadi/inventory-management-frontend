import axios from '../axios';
import useAuth from './useAuth';

function useRefreshToken() {
  const auth = useAuth();

  async function refresh() {
    try {
      const res = await axios.get('/refresh');
      auth.setAuth((prev) => ({
        ...prev,
        id: res.data.data.user.id,
        userProfileId: res.data.data.user.userProfileId,
        username: res.data.data.user.username,
        email: res.data.data.user.email,
      }));

      return res;
    } catch (error) {
      console.log('use_refresh_token', error);
      return Promise.reject(error);
    }
  }
  return refresh;
}

export default useRefreshToken;
