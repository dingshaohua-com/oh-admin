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



## 列筛选功能实现总结

### 📦 新增文件

**`filter-column.tsx`** - 筛选 UI 组件（独立模块）

---

### 🔧 第一步：创建筛选组件

```tsx
// filter-column.tsx
export function ColumnFilter<TData>({ column }) {
  // 1. 状态管理
  const [isOpen, setIsOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<Set<string>>(new Set());
  
  // 2. 自动获取该列所有唯一值作为选项
  const uniqueValues = Array.from(column.getFacetedUniqueValues().keys());
  
  // 3. 渲染弹窗（使用 Portal 避免 overflow 截断）
  return createPortal(<弹窗内容 />, document.body);
}
```

---

### 🔧 第二步：创建多选筛选函数

```tsx
// filter-column.tsx
export function multiSelectFilter<TData>(row, columnId, filterValue: string[]) {
  if (!filterValue || filterValue.length === 0) return true;
  const value = String(row.getValue(columnId));
  return filterValue.includes(value);
}
```

---

### 🔧 第三步：集成到 DataTable

```tsx
// data-table.tsx
import { getFilteredRowModel, getFacetedUniqueValues } from "@tanstack/react-table";
import { ColumnFilter, multiSelectFilter } from "./filter-column";

const table = useReactTable({
  // ... 其他配置
  defaultColumn: {
    enableColumnFilter: false,         // 默认关闭筛选
    filterFn: multiSelectFilter,       // 默认筛选函数
  },
  state: { columnFilters },            // 筛选状态
  onColumnFiltersChange: setColumnFilters,
  getFilteredRowModel: getFilteredRowModel(),    // 启用筛选
  getFacetedUniqueValues: getFacetedUniqueValues(), // 获取唯一值
});

// 表头渲染筛选图标
{isFilterable && <ColumnFilter column={header.column} />}
```

---

### 🔧 第四步：添加样式

```css
/* styles.css */
.column-filter { position: relative; }
.filter-trigger { /* 筛选按钮 */ }
.filter-trigger.active { color: #3b82f6; } /* 激活态 */
.filter-popover { /* 弹窗面板 */ }
.filter-option { /* 选项行 */ }
.filter-actions { /* 重置/确定按钮 */ }
```

---

### ✅ 使用方式

```tsx
const columns = [
  {
    header: "角色",
    accessorKey: "role",
    enableColumnFilter: true,  // 只需这一行！
  },
];
```

---

### 🎯 关键 API 总结

| API | 说明 |
|-----|------|
| `getFilteredRowModel()` | 启用筛选功能的行模型 |
| `getFacetedUniqueValues()` | 获取列的所有唯一值 |
| `column.getCanFilter()` | 判断列是否可筛选 |
| `column.getFilterValue()` | 获取当前筛选值 |
| `column.setFilterValue()` | 设置筛选值 |

---

### 📁 文件结构（代码分离）

```
table/
├── data-table.tsx     # 核心表格（状态管理）
├── filter-column.tsx  # 筛选 UI（独立）
├── select-column.tsx  # checkbox 列（独立）
├── styles.css
├── types.ts
└── index.tsx          # 统一导出
```

---

### 💡 设计亮点

1. **代码分离** - 筛选 UI 独立文件，不入侵核心
2. **Portal 渲染** - 弹窗不受表格 overflow 影响
3. **自动获取选项** - 从数据中自动提取唯一值
4. **零配置使用** - 只需 `enableColumnFilter: true`