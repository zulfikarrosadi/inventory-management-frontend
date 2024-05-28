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
    .email('Please input valid email format')
    .transform((val) => val.toLowerCase()),
  password: z.string().min(1, 'Password is required'),
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
        throw new Error(user.errors.message);
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
      <div className="h-full flex justify-center mt-5 flex-col gap-10">
        <div className="flex gap-2 flex-col">
          <h1 className="text-2xl">Sign In</h1>
          <p className="text-base text-gray-400">
            Enter your details to continue
          </p>
        </div>
        {requestError && (
          <div className="text-white text-base/10 bg-red-500 rounded-md p-2">
            {JSON.stringify(requestError)}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <ul className="flex flex-col gap-4">
            <li className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  autoFocus
                  className="border border-gray-400 rounded-md outline outline-1 w-1/3"
                />
              </div>
              <p className="text-sm text-red-500">
                {errors.email && errors.email.message}
              </p>
            </li>
            <li className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  {...register('password')}
                  className="w-1/3 border border-gray-400 rounded-md outline outline-1"
                />
              </div>
              <p className="text-sm text-red-500">
                {errors.password && errors.password.message}
              </p>
            </li>
            <li>
              <button
                disabled={isLoading}
                className="bg-gray-400 p-2 w-1/5 text-white rounded-md"
              >
                Sign In
              </button>
            </li>
          </ul>
        </form>
      </div>
    </>
  );
}

export default SignIn;
