import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from 'react';

type User = {
  id: number;
  userProfileId: number;
  username: string;
  email: string;
};

const INTIAL_VALUE = {
  id: 0,
  email: '',
  username: '',
  userProfileId: 0,
};

const AuthContext = createContext<{
  auth: User;
  setAuth: Dispatch<SetStateAction<User>>;
}>({
  auth: INTIAL_VALUE,
  setAuth: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<User>(INTIAL_VALUE);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
