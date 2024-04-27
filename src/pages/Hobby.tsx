import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxios from '../hooks/useAxios';
import { AxiosResponse } from 'axios';
import JoinHobbyButton from '../components/JoinHobbyButton';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useHobby from '../hooks/useHobby';
import useAuth from '../hooks/useAuth';
import DeletePostButton from '../components/DeletePostButton';

type Hobby = {
  id: number;
  name: string;
  description: string;
  image: string;
  isJoined: boolean;
  posts: {
    id: number;
    content: string;
    createdAt: string;
    user: { userProfileId: number; username: string };
  }[];
};

type ApiResponse = {
  status: 'success' | 'fail';
  data: { hobby: Hobby };
  errors: { code: number; message: string };
};

const CreatePostSchema = z.object({
  content: z
    .string({ required_error: 'content is required' })
    .min(1, 'content is required'),
  hobbyId: z.number(),
});

function Hobby() {
  const { hobbyId } = useParams();
  const axios = useAxios();
  const { auth } = useAuth();
  const {
    getHobby,
    hobby,
    error: hobbyError,
    setError: setHobbyError,
  } = useHobby(parseInt(hobbyId!, 10));
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isPosting },
  } = useForm<z.TypeOf<typeof CreatePostSchema>>({
    resolver: zodResolver(CreatePostSchema),
  });

  const onSubmit: SubmitHandler<z.TypeOf<typeof CreatePostSchema>> = async (
    data,
  ) => {
    try {
      const { data: res } = await axios.post<{}, AxiosResponse<ApiResponse>>(
        '/posts',
        JSON.stringify(data),
        { headers: { 'Content-Type': 'application/json' } },
      );
      if (res.status === 'success') {
        await getHobby();
        reset();
      } else {
        setHobbyError((prev) => (prev = res.errors.message));
      }
    } catch (error) {
      console.log('create_post', error);
    }
  };

  useEffect(() => {
    getHobby();
  }, []);

  return (
    <>
      {hobby ? (
        <>
          <div>
            <div className="profile_picture">
              <img src={hobby.image} alt="" />
            </div>
            <h1>{hobby.name}</h1>
            <p>{hobby.description}</p>
            {!hobby.isJoined && <JoinHobbyButton hobby={hobby} />}
          </div>
          <main>
            {!hobby.isJoined && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <input
                  type="text"
                  id="content"
                  placeholder="Have something in your mind...?"
                  {...register('content')}
                />
                <span>{errors.content && errors.content.message}</span>
                <span>{hobbyError && hobbyError}</span>
                <input
                  type="hidden"
                  {...register('hobbyId', { value: hobby.id })}
                />
                <button disabled={isPosting}>
                  {!isPosting ? 'Create Post' : 'Creating...'}
                </button>
              </form>
            )}
            <div>
              {hobby.posts.length
                ? hobby.posts.map((post) => {
                    return (
                      <>
                        <div>
                          <div>
                            <div>
                              <h3>{post.user.username}</h3>
                              <p>
                                {new Date(
                                  Date.parse(post.createdAt),
                                ).toDateString()}
                              </p>
                            </div>
                            <div>
                              {post.user.userProfileId ===
                              auth.userProfileId ? (
                                <>
                                  <DeletePostButton postId={post.id} />
                                  <button>Update</button>
                                </>
                              ) : null}
                            </div>
                          </div>
                          <p>{post.content}</p>
                          <hr />
                        </div>
                      </>
                    );
                  })
                : 'No posts yet...'}
            </div>
          </main>
        </>
      ) : (
        'Loading...'
      )}
    </>
  );
}

export default Hobby;
