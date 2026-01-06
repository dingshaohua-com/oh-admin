import { DataTable } from "@repo/ui-comps/table";
import { columns } from "./helper";
import SearchForm from "./form";
import { useState } from "react";
import { useUsers } from "@/api/user";


export default function Users() {
  const [pageSize, setPageSize] = useState(1);
  const { data } = useUsers(pageSize)
  const users = data || [];

  

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
          columns={columns}
          data={users}
          onRowClick={(row) => console.log("点击行:", row.original)}
          className="border rounded-lg"
        />
      </div>
    </div>
  );
}
