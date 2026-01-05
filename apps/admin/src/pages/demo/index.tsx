import { DataTable } from "@repo/ui-comps/table";
import { columns, users } from "./helper";

export default function UserTable() {
  return (
    <div className="demo-page flex justify-center items-center h-full w-full">
      <DataTable
        onSelectionChange={(selectedRows) =>
          console.log("选中行:", selectedRows)
        }
        enableRowSelection
        columns={columns}
        data={users}
        onRowClick={(row) => console.log("点击行:", row.original)}
        className="max-w-240 border rounded-lg"
      />
    </div>
  );
}
