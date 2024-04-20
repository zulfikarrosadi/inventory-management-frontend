import { Outlet, NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function Root() {
  const { auth } = useAuth();
  return (
    <>
      <header>
        <nav>
          <menu>
            {!auth.username ? (
              <>
                <li>
                  <NavLink to="/auth/signin">Sign In</NavLink>
                </li>
                <li>
                  <NavLink to="/auth/signup">Sign Up</NavLink>
                </li>
              </>
            ) : (
              <>
                {auth.username}
                <li>
                  <NavLink to="/">Home</NavLink>
                </li>
                <li>
                  <NavLink to="/hobbies">Hobbies</NavLink>
                </li>
                <li>
                  <NavLink to="/me">Profile</NavLink>
                </li>
                <li>
                  <NavLink to="/auth/signout">Log Out</NavLink>
                </li>
              </>
            )}
          </menu>
        </nav>
      </header>
      <Outlet />
    </>
  );
}

export default Root;
