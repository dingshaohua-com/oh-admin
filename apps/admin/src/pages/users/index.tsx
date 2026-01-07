import { DataTable } from "@repo/ui-comps/table";
import { getColumns } from "./helper";
import SearchForm from "./form";
import { useState } from "react";
import { createUser, deleteUser, updateUser, useUsers } from "@/api/user";
import type { User } from "./type";
import { toast } from "@repo/shadcn-comps/sonner";
import { Button } from "@repo/shadcn-comps/button";
import UserModal from "./user-modal";

export default function Users() {
  const [pageSize, setPageSize] = useState(1);
  const { data, mutate } = useUsers(pageSize);
  const users = data || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const onAdd = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const onEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleSubmit = async (data: { id?: number; name: string; email: string; gender: boolean }) => {
    if (data.id) {
      const toastId = toast.loading("正在保存...");
      await updateUser(data.id, { name: data.name, email: data.email, gender: data.gender });
      toast.success("保存成功", { id: toastId });
      await mutate();
      toast.dismiss(toastId);
    } else {
      const toastId = toast.loading("正在创建...");
      await createUser({ name: data.name, email: data.email, gender: data.gender });
      toast.success("创建成功", { id: toastId });
      await mutate();
      toast.dismiss(toastId);
    }
  };

  const onDelete = async (user: User) => {
    const toastId = toast.loading("正在删除...");
    await deleteUser(user.id);
    toast.success("删除成功", { id: toastId });
    await mutate();
    toast.dismiss(toastId);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
       <SearchForm />
      <div className="bg-white p-2 flex-1">
      <div className="flex justify-end items-center my-2">
        <Button onClick={onAdd}>新增用户</Button>
      </div>
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

      <UserModal
        key={editingUser?.id ?? 'new'}
        open={modalOpen}
        user={editingUser ?? undefined}
        onOpenChange={setModalOpen}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
