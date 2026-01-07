import fetcher from "./fetcher";
import useSWR from "swr";
import type { User } from "../pages/users/type";

export const useUsers = (pageSize: number) => {
  return useSWR<User[]>("/users", fetcher, {
    suspense: true,
  });
};

export const deleteUser = (id: number) => {
  return fetcher.delete(`/users/${id}`);
};

export const updateUser = (id: number, data: Partial<User>) => {
  return fetcher.patch(`/users/${id}`, data);
};

export const createUser = (data: Omit<User, 'id'>) => {
  return fetcher.post('/users', data);
};

