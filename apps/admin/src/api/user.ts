import fetcher from "./fetcher";
import useSWR from "swr";
import type { User } from "../pages/users/type";
import { removeEmptyFields } from "@repo/common-utils";

export const useUsers = (params?: Partial<User>) => {
  const key = ["/users", params];
  return useSWR<User[]>(key, async ([url, queryParams]) => {
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