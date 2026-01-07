import type { Table } from "@tanstack/react-table";
import type { PaginationState } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useMemo } from "react";

export interface TablePaginationProps<TData> {
  /** tanstack table 实例 */
  table: Table<TData>;
  /** 可选的每页条数选项 */
  pageSizeOptions?: number[];
  /** 是否有上一页（服务端分页时使用，覆盖默认判断） */
  hasPreviousPage?: boolean;
  /** 是否有下一页（服务端分页时使用，覆盖默认判断） */
  hasNextPage?: boolean;
  /** 总数据条数（服务端分页时使用） */
  totalCount?: number;
  /** 是否使用服务端分页 */
  serverSidePagination?: boolean;
  /** 分页状态（用于确保显示正确的 pageSize） */
  pagination?: PaginationState;
}

export function TablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 50, 100],
  hasPreviousPage,
  hasNextPage,
  totalCount,
  serverSidePagination = false,
  pagination,
}: TablePaginationProps<TData>) {
  // 如果提供了自定义的上一页/下一页状态，使用它们；否则使用 table 的默认判断
  const canPreviousPage = hasPreviousPage !== undefined ? hasPreviousPage : table.getCanPreviousPage();
  const canNextPage = hasNextPage !== undefined ? hasNextPage : table.getCanNextPage();
  
  // 使用传入的 pagination state，如果没有则使用 table 的 state
  const paginationState = pagination || table.getState().pagination;
  
  // 计算总条数和总页数（使用 useMemo 确保依赖更新时重新计算）
  const { rowCount, pageCount } = useMemo(() => {
    const count = serverSidePagination && totalCount !== undefined ? totalCount : table.getRowCount();
    const pages = serverSidePagination && totalCount !== undefined
      ? Math.ceil(totalCount / paginationState.pageSize)
      : table.getPageCount();
    return { rowCount: count, pageCount: pages };
  }, [serverSidePagination, totalCount, paginationState.pageSize, paginationState.pageIndex, table]);
  
  return (
    <div className="pagination">
      <div className="pagination-info">
        <span>
          共 {rowCount} 条，
          第 {paginationState.pageIndex + 1} / {pageCount} 页
        </span>
      </div>

      <div className="pagination-size">
        <span>每页显示</span>
        <select
          value={paginationState.pageSize}
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
          disabled={!canPreviousPage}
          title="首页"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          type="button"
          className="pagination-btn"
          onClick={() => table.previousPage()}
          disabled={!canPreviousPage}
          title="上一页"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          className="pagination-btn"
          onClick={() => table.nextPage()}
          disabled={!canNextPage}
          title="下一页"
        >
          <ChevronRight size={16} />
        </button>
        <button
          type="button"
          className="pagination-btn"
          onClick={() => table.lastPage()}
          disabled={!canNextPage}
          title="末页"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}

