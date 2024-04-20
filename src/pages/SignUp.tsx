import { TypeOf, object, string } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import config from '../config';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';

export const signUpSchema = object({
  email: string({ required_error: 'Email is required' })
    .email('Your email format is invalid')
    .transform((val) => val.toLowerCase()),
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
      {requestError && JSON.stringify({ requestError })}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          <span>Email: </span>
          <input type="email" id="email" {...register('email')} />
          {formErrors.email && <p>{formErrors.email.message}</p>}
        </label>
        <label>
          <span>Password: </span>
          <input type="password" id="password" {...register('password')} />
          {formErrors.password && <p>{formErrors.password.message}</p>}
        </label>
        <label>
          <span>Confirm your password: </span>
          <input
            type="password"
            id="passwordConfirmation"
            {...register('passwordConfirmation')}
          />
          {formErrors.passwordConfirmation && (
            <p>{formErrors.passwordConfirmation.message}</p>
          )}
        </label>
        <button>Sign Up</button>
      </form>
    </>
  );
}

export default SignUp;
