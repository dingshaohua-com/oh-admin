import { DataTable } from "@repo/ui-comps/table";
import { getColumns } from "./helper";
import SearchForm from "./form";
import { useState } from "react";
import { deleteUser, useUsers } from "@/api/user";
import type { User } from "./type";
import { toast } from "@repo/shadcn-comps/sonner";

export default function Users() {
  const [pageSize, setPageSize] = useState(1);
  const { data, mutate} = useUsers(pageSize);
  const users = data || [];

  const onEdit = (user: User) => {
    console.log("编辑:", user);
  };

  const onDelete = async (user: User) => {
    const toastId = toast.loading("正在删除...")
    await deleteUser(user.id);
    toast.success("删除成功", { id: toastId });
    await mutate();
    toast.dismiss(toastId)
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <SearchForm />
      <div className="bg-white p-2 flex-1">
        <DataTable
          onSelectionChange={(selectedRows) =>
            console.log("选中行:", selectedRows)
          }
          pageSize={10}
          enablePagination
          enableRowSelection
          columns={getColumns({
            onEdit,
            onDelete,
          })}
          data={users}
          onRowClick={(row) => console.log("点击行:", row.original)}
          className="border rounded-lg"
        />
      </div>
    </div>
  );
}
