import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import DeletePostButton from './DeletePostButton';
import UpdatePostForm from './UpdatePostForm';

type Post = {
  id: number;
  content: string;
  createdAt: string;
  user: {
    userProfileId: number;
    username: string;
  };
};

function Post({
  post,
  getHobby,
  hobbyId,
}: {
  post: Post;
  getHobby: () => void;
  hobbyId: number;
}) {
  const { auth } = useAuth();
  const [update, setUpdate] = useState(false);
  return (
    <div className="flex flex-col">
      <div>
        <div>
          <h3>{post.user.username}</h3>
          <p>{new Date(Date.parse(post.createdAt)).toDateString()}</p>
        </div>
        <div>
          {post.user.userProfileId === auth.userProfileId ? (
            <>
              <DeletePostButton postId={post.id} getHobby={getHobby} />
              <button onClick={() => setUpdate(true)}>Update</button>
              {update && (
                <UpdatePostForm
                  post={post}
                  getHobby={getHobby}
                  hobbyId={hobbyId}
                  setUpdate={setUpdate}
                />
              )}
            </>
          ) : null}
        </div>
      </div>
      <p>{post.content}</p>
      <hr />
    </div>
  );
}

export default Post;
