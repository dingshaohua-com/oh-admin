// packages/ui-comps/src/table/types.ts
import {
    ColumnDef,
    Table as TanStackTable,
    Row,
    Cell,
    RowSelectionState,
    PaginationState,
  } from '@tanstack/react-table'
  
  export interface DataTableProps<TData> {
    /** 表格列配置 */
    columns: ColumnDef<TData>[]
    /** 表格数据 */
    data: TData[]
    /** 加载状态 */
    isLoading?: boolean
    /** 空数据时显示的内容 */
    emptyMessage?: string
    /** 表格类名 */
    className?: string
    /** 行点击事件 */
    onRowClick?: (row: Row<TData>) => void
    /** 是否启用行选择 */
    enableRowSelection?: boolean
    /** 选中状态变化回调 */
    onSelectionChange?: (selectedRows: TData[]) => void
    /** 是否启用分页 */
    enablePagination?: boolean
    /** 每页显示条数，默认 10 */
    pageSize?: number
    /** 可选的每页条数选项 */
    pageSizeOptions?: number[]
    /** 分页状态变化回调（用于服务端分页） */
    onPaginationChange?: (pagination: PaginationState) => void
    /** 是否使用服务端分页，默认 false（前端分页） */
    serverSidePagination?: boolean
    /** 总数据条数（服务端分页时需要） */
    totalCount?: number
    /** 是否有上一页（服务端分页时使用，覆盖默认判断） */
    hasPreviousPage?: boolean
    /** 是否有下一页（服务端分页时使用，覆盖默认判断） */
    hasNextPage?: boolean
  }

  export type { PaginationState }
  
  export type { ColumnDef, Row, Cell, TanStackTable, RowSelectionState }