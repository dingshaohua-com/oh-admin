import { useEffect, useRef, type HTMLProps } from "react";
import type { ColumnDef } from "@tanstack/react-table";

// 支持 indeterminate 状态的 Checkbox 组件
function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate ?? false;
    }
  }, [indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={`row-checkbox ${className}`}
      {...rest}
    />
  );
}

/**
 * 创建一个 checkbox 选择列
 * @example
 * const columns = [
 *   getSelectColumn<User>(),
 *   { header: "姓名", accessorKey: "name" },
 *   // ...其他列
 * ];
 */
export function getSelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: "_select",
    header: ({ table }) => (
      <IndeterminateCheckbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <IndeterminateCheckbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  };
}

