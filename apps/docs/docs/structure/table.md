## 基础表格
```tsx
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import { DataTableProps } from './types'
import './styles.css'

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  emptyMessage = '暂无数据',
  className = '',
  onRowClick,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return (
      <div className={`data-table loading ${className}`}>
        <div className="loading-spinner">加载中...</div>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className={`data-table empty ${className}`}>
        <div className="empty-message">{emptyMessage}</div>
      </div>
    )
  }

  return (
    <div className={`data-table ${className}`}>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'clickable' : ''}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```


## 添加排序

### 1. 导入排序相关模块

```typescript
import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,  // 新增
  flexRender,
  type SortingState,  // 新增
} from "@tanstack/react-table";
```

### 2. 添加排序状态管理

```typescript
const [sorting, setSorting] = useState<SortingState>([]);
```

### 3. 配置 useReactTable

```typescript
const table = useReactTable({
  data,
  columns,
  defaultColumn: {
    enableSorting: false, // 列默认禁用排序
  },
  state: {
    sorting,  // 绑定排序状态
  },
  onSortingChange: setSorting,  // 排序变化回调
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),  // 启用排序模型
});
```

### 4. 表头添加排序交互

```tsx
{headerGroup.headers.map((header) => {
  const isSortable = header.column.getCanSort();
  const sortDirection = header.column.getIsSorted();

  return (
    <th
      key={header.id}
      className={isSortable ? "sortable" : ""}
      onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
    >
      <span className="th-content">
        {flexRender(header.column.columnDef.header, header.getContext())}
        {isSortable && (
          <span className="sort-indicator">
            {sortDirection === "asc" ? " ↑" : sortDirection === "desc" ? " ↓" : " ↕"}
          </span>
        )}
      </span>
    </th>
  );
})}
```

### 5. 添加 CSS 样式

```css
.data-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease;
}

.data-table th.sortable:hover {
  background-color: #e9ecef;
}

.data-table th .th-content {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.data-table th .sort-indicator {
  opacity: 0.5;
  font-size: 12px;
}

.data-table th.sortable:hover .sort-indicator {
  opacity: 0.8;
}
```

### 6. 列定义中启用排序

```typescript
const columns = [
  {
    header: "姓名",
    accessorKey: "name",
    enableSorting: true,  // 显式启用排序
  },
  // 其他列默认不支持排序
];
```

---

**关键 API：**
| API | 说明 |
|-----|------|
| `getSortedRowModel()` | 启用排序功能的行模型 |
| `column.getCanSort()` | 判断列是否可排序 |
| `column.getIsSorted()` | 获取当前排序方向 (`"asc"` / `"desc"` / `false`) |
| `column.getToggleSortingHandler()` | 获取切换排序的点击处理函数 |