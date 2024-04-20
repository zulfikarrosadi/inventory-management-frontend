import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function RequireAuth() {
  const location = useLocation();
  const { auth } = useAuth();
  console.log(auth);

  if (!auth.userProfileId) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default RequireAuth;
