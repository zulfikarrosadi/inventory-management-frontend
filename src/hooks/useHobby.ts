import { AxiosResponse } from 'axios';
import useAxios from './useAxios';
import { useState } from 'react';

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
  status: 'success';
  data: { hobby: Hobby };
};

function useHobby(hobbyId: number) {
  const axios = useAxios();
  const [hobby, setHobby] = useState<Hobby>();
  const [error, setError] = useState<string>();

  async function getHobby() {
    try {
      const { data: res } = await axios.get<{}, AxiosResponse<ApiResponse>>(
        `/hobbies/${hobbyId}`,
      );
      setHobby((prev) => ({
        ...prev,
        id: res.data.hobby.id,
        image: res.data.hobby.image,
        description: res.data.hobby.description,
        name: res.data.hobby.name,
        isJoined: res.data.hobby.isJoined,
        posts: res.data.hobby.posts,
      }));
    } catch (error: any) {
      console.log(error);
      setError(error);
    }
  }

  return { getHobby, hobby, error, setError };
}

export default useHobby;
