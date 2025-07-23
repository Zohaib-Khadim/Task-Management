import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AuthData {
  email: string;
  password: string;
  full_name?: string;
}

interface AuthResponse {
  token: string;
}

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation<AuthResponse, Error, AuthData>({
    mutationFn: (data) => axios.post('http://localhost:5000/api/auth/login', data).then((res) => res.data),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      const decoded = JSON.parse(atob(data.token.split('.')[1]));
      queryClient.setQueryData(['user'], { id: decoded.id, email: decoded.email });
      navigate('/dashboard');
    },
  });

  const registerMutation = useMutation<AuthResponse, Error, AuthData>({
    mutationFn: (data) => axios.post('http://localhost:5000/api/auth/register', data).then((res) => res.data),
    onSuccess: () => {
      navigate('/login');
    },
  });

  const logout = () => {
    localStorage.removeItem('token');
    queryClient.setQueryData(['user'], null);
    navigate('/login');
  };

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: () => {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return { id: decoded.id, email: decoded.email } as const;
    },
    initialData: null,
  });

  return { loginMutation, registerMutation, logout, user: userQuery.data };
};