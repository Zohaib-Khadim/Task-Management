import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface User {
  id: number;
  email: string;
  full_name: string;
  password_hash?: string;
  created_at?: string;
}

export const useUsers = () => {
  const token = localStorage.getItem('token');

  const usersQuery = useQuery<User[] | undefined, Error>({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        console.log("enter");
        
        const response = await axios.get('http://localhost:5000/api/users', { headers: { Authorization: `Bearer ${token}` } });
        console.log("response.data------>",response.data)
        const data = response.data as User[];
        console.log('Users data:', data);
        if (!Array.isArray(data)) throw new Error('API returned non-array data');
        return data;
      } catch (error) {
        console.error('API error for users:', error);
        return []; // Fallback to empty array on error
      }
    },
    enabled: !!token,
    initialData: [],
  });

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
  };
};