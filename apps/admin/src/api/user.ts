import fetcher from "./fetcher";
import useSWR from "swr";
import type { User } from "../pages/users/type";

export const useUsers = (pageSize: number) => {
  return useSWR<User[]>("/users", fetcher, {
    suspense: true,
  });
};
