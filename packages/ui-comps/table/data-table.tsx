import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ColumnFilter, multiSelectFilter } from "./filter-column";
import { getSelectColumn } from "./select-column";
import type { DataTableProps } from "./types";
import "./styles.css";

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "暂无数据",
  className = "",
  onRowClick,
  enableRowSelection = false,
  onSelectionChange,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // 启用行选择时自动添加 checkbox 列
  const allColumns = useMemo(() => {
    if (!enableRowSelection) return columns;
    return [getSelectColumn<TData>(), ...columns];
  }, [columns, enableRowSelection]);

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
    },
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
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

  if (!data.length) {
    return (
      <div className={`data-table empty ${className}`}>
        <div className="empty-message">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={`data-table ${className}`}>
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
          {table.getRowModel().rows.map((row) => {
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
          })}
        </tbody>
      </table>
    </div>
  );
}
