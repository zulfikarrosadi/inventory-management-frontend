import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import useAxios from '../hooks/useAxios';

const DeletePostSchema = z.object({
  postId: z.number(),
});

function DeletePostButton({ postId }: { postId: number }) {
  const { register, handleSubmit } = useForm<z.TypeOf<typeof DeletePostSchema>>(
    {
      resolver: zodResolver(DeletePostSchema),
      defaultValues: { postId },
    },
  );
  const axios = useAxios();

  const onSubmit: SubmitHandler<z.TypeOf<typeof DeletePostSchema>> = async (
    data,
  ) => {
    try {
      const res = await axios.delete(`/posts/${data.postId}`);
      if (res.status !== 204) {
        console.log(res.data);
        throw new Error(res.data.errors.message);
      }
      console.log(res);
    } catch (error) {
      console.log('delete_post_button', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="hidden"
        {...register('postId', { value: postId })}
        value={postId}
      />
      <button>Delete</button>
    </form>
  );
}

export default DeletePostButton;
