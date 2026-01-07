import fetcher from "./fetcher";
import useSWR from "swr";
import type { User } from "../pages/users/type";
import { removeEmptyFields } from "@repo/common-utils";

export interface UseUsersParams extends Partial<User> {
  _page?: number;
  _per_page?: number;
}

export interface PaginatedResponse<T> {
  first: number | null;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: T[];
}

export const useUsers = (params?: UseUsersParams) => {
  const key = ["/users", params];
  return useSWR<PaginatedResponse<User>>(key, async ([url, queryParams]) => {
    // 过滤空值，只保留有值的参数
    const validParams = removeEmptyFields(queryParams);
    return fetcher.get(url, { params: validParams });
  }, {
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