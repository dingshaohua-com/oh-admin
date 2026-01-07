import {
  type ColumnFiltersState,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Inbox } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ColumnFilter, multiSelectFilter } from "./filter-column";
import { TablePagination } from "./pagination";
import { getSelectColumn } from "./select-column";
import type { DataTableProps } from "./types";
import "./styles.css";

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "暂无数据",
  className = "",
  style,
  onRowClick,
  enableRowSelection = false,
  onSelectionChange,
  enablePagination = false,
  pageSize = 10,
  pageSizeOptions,
  onPaginationChange,
  serverSidePagination = false,
  totalCount,
  hasPreviousPage,
  hasNextPage,
  maxHeight,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  // 同步外部传入的 pageSize 到内部状态
  useEffect(() => {
    if (pagination.pageSize !== pageSize) {
      setPagination(prev => ({ ...prev, pageSize }));
    }
  }, [pageSize]);

  // 启用行选择时自动添加 checkbox 列
  const allColumns = useMemo(() => {
    if (!enableRowSelection) return columns;
    return [getSelectColumn<TData>(), ...columns];
  }, [columns, enableRowSelection]);

  // 处理分页变化
  const handlePaginationChange = (updater: PaginationState | ((old: PaginationState) => PaginationState)) => {
    const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
    // 如果 pageSize 改变了，重置到第一页
    const finalPagination = newPagination.pageSize !== pagination.pageSize
      ? { ...newPagination, pageIndex: 0 }
      : newPagination;
    setPagination(finalPagination);
    if (onPaginationChange) {
      onPaginationChange(finalPagination);
    }
  };

  // 计算是否有上一页/下一页（服务端分页时）
  const computedHasPreviousPage = useMemo(() => {
    if (serverSidePagination && totalCount !== undefined) {
      return pagination.pageIndex > 0;
    }
    return hasPreviousPage;
  }, [serverSidePagination, totalCount, pagination.pageIndex, hasPreviousPage]);

  const computedHasNextPage = useMemo(() => {
    if (serverSidePagination && totalCount !== undefined) {
      const totalPages = Math.ceil(totalCount / pagination.pageSize);
      return pagination.pageIndex + 1 < totalPages;
    }
    return hasNextPage;
  }, [serverSidePagination, totalCount, pagination.pageIndex, pagination.pageSize, hasNextPage]);

  const table = useReactTable({
    data,
    columns: allColumns,
    defaultColumn: {
      enableSorting: false,
      enableColumnFilter: false,
      filterFn: multiSelectFilter,  // 默认使用多选筛选
    },
    state: {
      sorting,
      rowSelection,
      columnFilters,
      ...(enablePagination && { pagination }),
    },
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    // 服务端分页时不使用前端分页模型
    ...(enablePagination && !serverSidePagination && { getPaginationRowModel: getPaginationRowModel() }),
    // 服务端分页时需要手动设置页数
    ...(enablePagination && serverSidePagination && {
      manualPagination: true,
      ...(totalCount !== undefined && {
        pageCount: Math.ceil(totalCount / pagination.pageSize),
      }),
    }),
  });

  // 选中状态变化时通知外部
  useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, onSelectionChange, table]);

  if (isLoading) {
    return (
      <div className={`data-table loading ${className}`}>
        <div className="loading-spinner">加载中...</div>
      </div>
    );
  }

  // 检查是否需要启用滚动：
  // 1. 设置了 maxHeight
  // 2. className 中包含 flex-1
  // 3. style 中设置了 flex 相关属性（flex: 1, flex: '1', flex: '1 1 0%' 等）
  const hasFlex1InClassName = className.includes('flex-1');
  
  // 检查 style 中的 flex 属性
  const hasFlex1InStyle = useMemo(() => {
    if (!style?.flex) return false;
    const flexValue = style.flex;
    // 支持多种 flex 值格式：1, '1', '1 1 0%', '1 1 auto', '1 0 auto' 等
    if (typeof flexValue === 'number' && flexValue >= 1) return true;
    if (typeof flexValue === 'string') {
      const flexStr = String(flexValue).trim();
      // 检查是否以 '1' 开头（如 '1', '1 1 0%', '1 1 auto' 等）
      // 排除 'auto' 和 'none'，它们不是 flex: 1
      if (flexStr === 'auto' || flexStr === 'none') return false;
      return flexStr.startsWith('1');
    }
    return false;
  }, [style?.flex]);
  
  const hasFlex1 = hasFlex1InClassName || hasFlex1InStyle;
  const shouldEnableScroll = maxHeight || hasFlex1;

  // 计算表格容器的样式（只有设置了 maxHeight 时才需要内联样式）
  const tableContainerStyle = maxHeight
    ? {
        maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
        overflowY: 'auto' as const,
      }
    : undefined;

  const tableContainerClassName = shouldEnableScroll
    ? 'data-table-container data-table-scrollable'
    : 'data-table-container';

  // 如果使用 flex-1，需要让外层容器也支持 flex
  const wrapperClassName = hasFlex1
    ? `data-table flex flex-col ${className}`
    : `data-table ${className}`;

  return (
    <div className={wrapperClassName} style={style}>
      <div className={tableContainerClassName} style={tableContainerStyle}>
        <table>
          <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isSortable = header.column.getCanSort();
                const sortDirection = header.column.getIsSorted();
                const isFilterable = header.column.getCanFilter();

                return (
                  <th key={header.id}>
                    <span className="th-content">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {isSortable && (
                        <button
                          type="button"
                          className={`sort-trigger ${sortDirection ? "active" : ""}`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {sortDirection === "asc" ? (
                            <ArrowUp size={14} />
                          ) : sortDirection === "desc" ? (
                            <ArrowDown size={14} />
                          ) : (
                            <ArrowUpDown size={14} />
                          )}
                        </button>
                      )}
                      {isFilterable && <ColumnFilter column={header.column} />}
                    </span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {!data.length ? (
            <tr className="empty-row">
              <td colSpan={allColumns.length} className="empty-cell">
                <div className="empty-state">
                  <Inbox size={48} className="empty-icon" />
                  <div className="empty-message">{emptyMessage}</div>
                </div>
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => {
              const isSelected = row.getIsSelected();
              const rowClasses = [
                onRowClick ? "clickable" : "",
                isSelected ? "selected" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={rowClasses}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
        </table>
      </div>

      {/* 分页控制器 */}
      {enablePagination && data.length > 0 && (
        <TablePagination 
          table={table} 
          pageSizeOptions={pageSizeOptions}
          hasPreviousPage={computedHasPreviousPage}
          hasNextPage={computedHasNextPage}
          totalCount={totalCount}
          serverSidePagination={serverSidePagination}
          pagination={pagination}
        />
      )}
    </div>
  );
}
