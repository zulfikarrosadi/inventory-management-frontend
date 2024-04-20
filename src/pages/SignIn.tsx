import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';
import config from '../config';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const signInSchema = z.object({
  email: z
    .string()
    .email('please input valid email format')
    .transform((val) => val.toLowerCase()),
  password: z.string().min(1, 'password is required'),
});

type User = z.TypeOf<typeof signInSchema>;

function SignIn() {
  const [requestError, setRequestError] = useState();
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/me';

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<User>({ resolver: zodResolver(signInSchema) });

  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      const res = await fetch(`${config.baseURL}/login`, {
        method: 'post',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const user = await res.json();
      if (!res.ok) {
        throw new Error(user.errors[0].message);
      }
      console.log({ user });
      setAuth(user.data.user);
      return navigate(from, { replace: true });
    } catch (error: any) {
      console.log(error);
      setRequestError(error.message);
    }
  };
  return (
    <>
      {requestError && JSON.stringify(requestError)}
      <form onSubmit={handleSubmit(onSubmit)}>
        <ul>
          <li>
            <label htmlFor="email">Email: </label>
            <input type="email" id="email" {...register('email')} autoFocus />
            {errors.email && errors.email.message}
          </li>
          <li>
            <label htmlFor="password">Password: </label>
            <input type="password" id="password" {...register('password')} />
            {errors.password && errors.password.message}
          </li>
          <button disabled={isLoading}>Sign In</button>
        </ul>
      </form>
    </>
  );
}

export default SignIn;
