import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from 'react-router-dom';
import Root from './layouts/Root';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import RequireAuth from './layouts/RequireAuth';
import Hobbies from './pages/Hobbies';
import Profile from './pages/Profile';
import Hobby from './pages/Hobby';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path="auth">
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="hobbies">
            <Route index element={<Hobbies />} />
            <Route path=":hobbyId" element={<Hobby />} />
          </Route>
          <Route path="me" element={<Profile />} />
        </Route>
      </Route>,
    ),
  );
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
