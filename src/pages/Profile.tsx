import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import config from '../config';

type User = {
  id: number;
  username: string;
  fullName: string;
  bio: string;
  sosmed: {
    instagram: string;
    tiktok: string;
    linkedin: string;
    website: string;
  };
  hobbies: { id: number; name: string; description: string; image: string }[];
};

function Profile() {
  const { auth } = useAuth();
  const [user, setUser] = useState<User>();
  useEffect(() => {
    const abortController = new AbortController();
    fetch(`${config.baseURL}/user/${auth.userProfileId}`, {
      credentials: 'include',
      signal: abortController.signal,
    })
      .then((res) => res.json())
      .then((data) => setUser(data.data.user))
      .catch((error) => console.log(error));

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <>
      <h1>Hi! {auth.username}</h1>
      <div>
        <span>My Hobbies</span>
        <ul>
          {user?.hobbies.map((hobby) => {
            return (
              <li key={hobby.id}>
                <p>{hobby.name}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Profile;
