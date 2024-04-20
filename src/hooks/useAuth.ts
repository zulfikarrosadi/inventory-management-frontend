import { useContext } from 'react';
import AuthContext from '../contexts/Auth';

function useAuth() {
  return useContext(AuthContext);
}

export default useAuth;
