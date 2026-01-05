// packages/ui-comps/src/table/types.ts
import {
    ColumnDef,
    Table as TanStackTable,
    Row,
    Cell,
    RowSelectionState,
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
  }
  
  export type { ColumnDef, Row, Cell, TanStackTable, RowSelectionState }