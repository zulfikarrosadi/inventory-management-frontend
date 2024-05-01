import { FormEvent, useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';

type Post = {
  id: number;
  content: string;
  createdAt: string;
  user: {
    userProfileId: number;
    username: string;
  };
};

function UpdatePostForm({
  post,
  getHobby,
  hobbyId,
  setUpdate,
}: {
  post: Post;
  hobbyId: number;
  getHobby: () => void;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const axios = useAxios();
  const [postContent, setPostContent] = useState<string>();
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsUpdating((prev) => (prev = !prev));
    try {
      const { data: res } = await axios.put(
        `/posts/${post.id}`,
        JSON.stringify({ content: postContent, hobbyId }),
        { headers: { 'Content-Type': 'application/json' } },
      );
      if (res.status === 'success') {
        await getHobby();
        setUpdate((prev) => (prev = !prev));
        setIsUpdating((prev) => (prev = !prev));
      }
    } catch (error) {
      console.log('update post handler: ', error);
    }
  }

  useEffect(() => {
    setPostContent((prev) => (prev = post.content));
  }, []);

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <li>
        <input
          type="text"
          name="content"
          id="content"
          value={postContent}
          onChange={(e) => {
            setPostContent((prev) => (prev = e.target.value));
          }}
        />
        <button disabled={isUpdating}>
          {!isUpdating ? 'Update' : 'Updating...'}
        </button>
      </li>
    </form>
  );
}

export default UpdatePostForm;
