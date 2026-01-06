// packages/ui-comps/src/table/index.ts

export * as TanStackTable from '@tanstack/react-table'
export { DataTable } from './data-table'
export { ColumnFilter, multiSelectFilter } from './filter-column'
export { TablePagination, type TablePaginationProps } from './pagination'
export { getSelectColumn } from './select-column'
export type { Cell, ColumnDef, DataTableProps, Row } from './types'