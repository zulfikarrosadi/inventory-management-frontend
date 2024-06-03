import { TypeOf, object, string } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import config from '../config';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';

export const signUpSchema = object({
  username: string({ required_error: 'Username is required' }),
  password: string({ required_error: 'Password is required' }).min(
    8,
    'Password should have minimun 8 characters ',
  ),
  passwordConfirmation: string({
    required_error: 'Password confirmation is required',
  }),
}).refine((body) => body.password === body.passwordConfirmation, {
  path: ['passwordConfirmation'],
  message: 'Your password is not match',
});

type User = TypeOf<typeof signUpSchema>;

function SignUp() {
  const { setAuth } = useAuth();
  const [requestError, setRequestError] = useState();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<User>({ resolver: zodResolver(signUpSchema) });
  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      const res = await fetch(`${config.baseURL}/register`, {
        method: 'post',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const user = await res.json();
      if (!res.ok) {
        console.log(user.errors[0]);
        throw new Error(user.errors[0].message);
      }
      setAuth(user.data.user);
      return navigate('/');
    } catch (error: any) {
      setRequestError(error);
      return error;
    }
  };

  return (
    <>
      <div className="flex flex-col gap-10 h-full mt-5">
        <div className="space-y-2">
          <h1 className="text-2xl">Sign Up</h1>
          <p className="text-base text-gray-400">
            And start tracking your stocks
          </p>
        </div>
        {requestError && (
          <div className="text-white text-base/10 bg-red-500 rounded-md p-2">
            {JSON.stringify({ requestError })}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <ul className="flex flex-col gap-4">
            <li className="flex flex-col gap-2">
              <label>Username:</label>
              <input
                type="text"
                id="email"
                {...register('username')}
                className="md:w-1/4 w-1/2 border border-gray-400 rounded-md outline outline-1"
              />
              {formErrors.username && (
                <p className="text-sm text-red-500">
                  {formErrors.username.message}
                </p>
              )}
            </li>
            <li className="flex flex-col gap-2">
              <label>Password:</label>
              <input
                type="password"
                id="password"
                {...register('password')}
                className="md:w-1/4 w-1/2 border border-gray-400 rounded-md outline outline-1"
              />
              {formErrors.password && (
                <p className="text-sm text-red-500">
                  {formErrors.password.message}
                </p>
              )}
            </li>
            <li className="space-y-2">
              <label className="flex flex-col gap-2">
                Confirm your password:
              </label>
              <input
                type="password"
                id="passwordConfirmation"
                {...register('passwordConfirmation')}
                className="md:w-1/4 w-1/2 border border-gray-400 rounded-md outline outline-1"
              />
              {formErrors.passwordConfirmation && (
                <p className="text-sm text-red-500">
                  {formErrors.passwordConfirmation.message}
                </p>
              )}
            </li>
            <li>
              <button className="bg-gray-400 p-2 w-1/5 text-white rounded-md">
                Sign Up
              </button>
            </li>
          </ul>
        </form>
      </div>
    </>
  );
}

export default SignUp;
