import { toast } from "@repo/shadcn-comps/sonner";
import type { Row } from "@repo/ui-comps/table/types";
import type { User } from "./type";

export const columns = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "姓名",
    accessorKey: "name",
    enableSorting: true,
  },
  {
    header: "邮箱",
    accessorKey: "email",
  },
  {
    header: "角色",
    accessorKey: "role",
    enableColumnFilter: true, // 只需开启即可
  },
  {
    header: "操作",
    id: "actions", // 必须有唯一的 id
    cell: ({ row }: { row: Row<User> }) => (
      <div className="flex gap-2">
        <button
          onClick={() => toast("编辑:" + row.original.name)}
          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          编辑
        </button>
        <button
          onClick={() => alert("删除:" + row.original.name)}
          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          删除
        </button>
      </div>
    ),
  },
];

export const users: User[] = [
  { id: 1, name: "张三", email: "zhangsan@example.com", role: "管理员" },
  { id: 2, name: "李四", email: "lisi@example.com", role: "用户" },
];
