import useAxios from '../hooks/useAxios';
import { FormEvent } from 'react';

function DeletePostButton({
  postId,
  getHobby,
}: {
  postId: number;
  getHobby: () => void;
}) {
  const axios = useAxios();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await axios.delete(`/posts/${postId}`);
      if (res.status !== 204) {
        console.log(res.data);
        throw new Error(res.data.errors.message);
      } else {
        await getHobby();
      }
      console.log(res);
    } catch (error) {
      console.log('delete_post_button', error);
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <button>Delete</button>
    </form>
  );
}

export default DeletePostButton;
