import type { Row } from "@repo/ui-comps/table/types";
import type { GetColumnsProps, User } from "./type";



export const getColumns = (props: GetColumnsProps) => {
  return [
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
      header: "性别",
      accessorKey: "gender",
      enableColumnFilter: true, // 只需开启即可
      cell: ({ row }: { row: Row<User> }) => (
        <div className="flex items-center gap-2">
          <span className={row.original.gender ? "text-blue-500" : "text-red-500"}>
            {row.original.gender ? "男" : "女"}
          </span>
        </div>
      ),
    },
    {
      header: "操作",
      id: "actions", // 必须有唯一的 id
      cell: ({ row }: { row: Row<User> }) => (
        <div className="flex gap-2">
          <button
            onClick={() => props.onEdit(row.original)}
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            编辑
          </button>
          <button
            onClick={() => props.onDelete(row.original)}
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            删除
          </button>
        </div>
      ),
    },
  ];
}
