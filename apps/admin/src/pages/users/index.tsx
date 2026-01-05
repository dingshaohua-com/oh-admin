import { DataTable } from "@repo/ui-comps/table";
import { columns, users } from "./helper";
export default function Users() {
  return (
    <div>
      <DataTable
        onSelectionChange={(selectedRows) =>
          console.log('选中行:', selectedRows)
        }
        enableRowSelection
        columns={columns}
        data={users}
        onRowClick={(row) => console.log('点击行:', row.original)}
        className="border rounded-lg bg-white"
      />
    </div>
  );
}
