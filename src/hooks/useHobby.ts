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
  const [isFetchingHobby, setIsFetchingHobby] = useState(true);
  const [error, setError] = useState();

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

      setIsFetchingHobby(false);
    } catch (error: any) {
      console.log(error);
      setError(error);
    }
  }

  return { getHobby, hobby, isFetchingHobby, error, setError };
}

export default useHobby;
