import { DataTable } from "@repo/ui-comps/table";
import { getColumns } from "./helper";
import SearchForm, { type FormValues } from "./form";
import { useState } from "react";
import { createUser, deleteUser, updateUser, useUsers } from "@/api/user";
import type { User } from "./type";
import { toast } from "@repo/shadcn-comps/sonner";
import { Button } from "@repo/shadcn-comps/button";
import UserModal from "./user-modal";

export default function Users() {
  // 这个是搜索表单给接口的参数，只有在点击了提交按钮时，才会更新
  const [searchParams, setSearchParams] = useState<FormValues>();
  const { data, mutate } = useUsers(searchParams);
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

  const handleSubmit = async (data: {
    id?: number;
    name: string;
    email: string;
    gender: boolean;
  }) => {
    const isEdit = !!data.id;
    const loadingText = isEdit ? "正在保存..." : "正在创建...";
    const successText = isEdit ? "保存成功" : "创建成功";
    const userData = {
      name: data.name,
      email: data.email,
      gender: data.gender,
    };

    const toastId = toast.loading(loadingText);
    if (isEdit) {
      await updateUser(data.id!, userData);
    } else {
      await createUser(userData);
    }
    toast.success(successText, { id: toastId });
    await mutate();
    toast.dismiss(toastId);
  };

  const onDelete = async (user: User) => {
    const toastId = toast.loading("正在删除...");
    await deleteUser(user.id);
    toast.success("删除成功", { id: toastId });
    await mutate();
    toast.dismiss(toastId);
  };

  const onReset = () => setSearchParams(undefined);
  const onSubmit = (data: FormValues) => {
    console.log(data, 'data');
    
    setSearchParams(data)
  };

  const onBatchDelete = () => {
    toast.error("暂未实现批量删除");
  };
  return (
    <div className="flex flex-col gap-4 h-full">
      <SearchForm onReset={onReset} onSubmit={onSubmit} />
      <div className="bg-white p-2 flex-1">
        <div className="flex justify-end items-center my-2 space-x-2">
          <Button onClick={onBatchDelete} className="bg-red-500 cursor-pointer hover:bg-red-600">批量删除</Button>
          <Button onClick={onAdd} className="cursor-pointer">新增用户</Button>
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
        key={editingUser?.id ?? "new"}
        open={modalOpen}
        user={editingUser ?? undefined}
        onOpenChange={setModalOpen}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
