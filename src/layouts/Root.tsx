import { Outlet, NavLink, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function Root() {
  const { auth } = useAuth();
  return (
    <>
      <header className="w-full flex border-b-4">
        <nav className="w-10/12 m-auto">
          <menu className="flex justify-between gap-4 h-10 text-base/10">
            {!auth.username ? (
              <>
                <li>
                  <NavLink
                    to="/auth/signin"
                    className="hover:font-bold transition-all"
                  >
                    Sign In
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/auth/signup"
                    className="hover:font-bold transition-all"
                  >
                    Sign Up
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <div className="flex gap-4">
                  <li className="hover:font-bold transition-all">
                    <NavLink to="/">Home</NavLink>
                  </li>
                  <li className="hover:font-bold transition-all">
                    <NavLink to="/hobbies">Hobbies</NavLink>
                  </li>
                  <li className="hover:font-bold transition-all">
                    <NavLink to="/me">Profile</NavLink>
                  </li>
                  <li className="hover:font-bold transition-all">
                    <NavLink to="/auth/signout">Log Out</NavLink>
                  </li>
                </div>
                <li>
                  <Link to="me">
                    <span className="font-bold">{auth.username}</span>
                  </Link>
                </li>
              </>
            )}
          </menu>
        </nav>
      </header>
      <main className="">
        <div className="w-10/12 m-auto">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default Root;
