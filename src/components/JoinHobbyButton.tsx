import { FormEvent } from 'react';
import useAxios from '../hooks/useAxios';

function JoinHobbyButton({
  hobby,
}: {
  hobby: { id: number; isJoined: boolean };
}) {
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

  return (
    <form onSubmit={handleJoin}>
      <input type="hidden" id="hobbyId" value={hobby.id} />
      <button id="joinBtn" disabled={hobby.isJoined}>
        {hobby.isJoined ? 'Joined' : 'Join'}
      </button>
    </form>
  );
}

export default JoinHobbyButton;
