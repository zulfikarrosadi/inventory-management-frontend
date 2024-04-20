import { FormEvent, useEffect, useState } from 'react';
import config from '../config';
import useAxios from '../hooks/useAxios';

type Hobbies = {
  id: number;
  name: string;
  description?: string;
  image: string;
  isJoined: boolean;
  users: { id: number; username: string }[];
}[];

function Hobbies() {
  const [hobbies, setHobbies] = useState<Hobbies>();
  const [isLoading, setIsLoading] = useState(true);
  const axios = useAxios();

  const handleJoin = async (event: FormEvent) => {
    event.preventDefault();
    const hobbyId = event.target?.hobbyId.value;
    const joinButton = event.target?.joinBtn as HTMLButtonElement;
    joinButton.disabled = true;
    joinButton.textContent = 'Processing...';
    try {
      const res = await axios.post(
        '/user/hobby',
        JSON.stringify({ hobbyId: [parseInt(hobbyId, 10)] }),
        { headers: { 'Content-Type': 'application/json' } },
      );
      if (res.status === 201) {
        joinButton.disabled = true;
        joinButton.textContent = 'Joined';
      } else {
        joinButton.disabled = false;
        joinButton.textContent = 'Join';
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetch(`${config.baseURL}/hobbies`, {
      credentials: 'include',
      signal: abortController.signal,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setIsLoading(false);
        console.log(data);
        setHobbies(data.data.hobbies);
      })
      .catch((error) => console.log(error));

    return () => {
      abortController.abort();
    };
  }, []);
  return (
    <>
      {!isLoading ? (
        <ul>
          {hobbies?.map((hobby) => {
            return (
              <li key={hobby.id}>
                <div>
                  <h3>{hobby.name}</h3>
                  <form onSubmit={handleJoin}>
                    <input type="hidden" id="hobbyId" value={hobby.id} />
                    <button id="joinBtn" disabled={hobby.isJoined}>
                      {hobby.isJoined ? 'Joined' : 'Join'}
                    </button>
                  </form>
                </div>
                <p>{hobby.description}</p>
              </li>
            );
          })}
        </ul>
      ) : (
        'Loading...'
      )}
    </>
  );
}

export default Hobbies;
