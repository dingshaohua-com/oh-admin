import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export interface TablePaginationProps<TData> {
  /** tanstack table 实例 */
  table: Table<TData>;
  /** 可选的每页条数选项 */
  pageSizeOptions?: number[];
}

export function TablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 50, 100],
}: TablePaginationProps<TData>) {
  return (
    <div className="pagination">
      <div className="pagination-info">
        <span>
          共 {table.getFilteredRowModel().rows.length} 条，
          第 {table.getState().pagination.pageIndex + 1} / {table.getPageCount()} 页
        </span>
      </div>

      <div className="pagination-size">
        <span>每页显示</span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span>条</span>
      </div>

      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-btn"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
          title="首页"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          type="button"
          className="pagination-btn"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          title="上一页"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          className="pagination-btn"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          title="下一页"
        >
          <ChevronRight size={16} />
        </button>
        <button
          type="button"
          className="pagination-btn"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
          title="末页"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}

