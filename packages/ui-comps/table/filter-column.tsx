import type { Column } from "@tanstack/react-table";
import { Filter } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ColumnFilterProps<TData> {
  column: Column<TData, unknown>;
}

interface PopoverPosition {
  top: number;
  left: number;
}

/**
 * 列筛选组件 - 弹出面板式多选筛选
 */
export function ColumnFilter<TData>({ column }: ColumnFilterProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<Set<string>>(new Set());
  const [position, setPosition] = useState<PopoverPosition>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // 获取该列所有唯一值
  const uniqueValues = Array.from(column.getFacetedUniqueValues().keys());

  // 当前已应用的筛选值
  const filterValue = column.getFilterValue() as string[] | undefined;
  const currentFilter = filterValue ?? [];
  const isFiltered = currentFilter.length > 0;

  // 计算弹窗位置
  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
  }, []);

  // 打开时同步当前筛选值并计算位置
  useEffect(() => {
    if (isOpen) {
      setPendingValues(new Set(filterValue ?? []));
      updatePosition();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // 滚动时更新位置
  useEffect(() => {
    if (isOpen) {
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, updatePosition]);

  const handleToggle = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();
    const next = new Set(pendingValues);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    setPendingValues(next);
  };

  const handleConfirm = () => {
    const values = Array.from(pendingValues);
    column.setFilterValue(values.length > 0 ? values : undefined);
    setIsOpen(false);
  };

  const handleReset = () => {
    setPendingValues(new Set());
  };

  return (
    <div className="column-filter">
      <button
        ref={triggerRef}
        type="button"
        className={`filter-trigger ${isFiltered ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <Filter size={14} />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            className="filter-popover"
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
            }}
          >
            <div className="filter-options">
              {uniqueValues.length === 0 ? (
                <div className="filter-empty">暂无选项</div>
              ) : (
                uniqueValues.map((value) => (
                  <label
                    key={String(value)}
                    className="filter-option"
                    onClick={(e) => handleToggle(e, String(value))}
                  >
                    <input
                      type="checkbox"
                      checked={pendingValues.has(String(value))}
                      readOnly
                    />
                    <span>{String(value)}</span>
                  </label>
                ))
              )}
            </div>
            <div className="filter-actions">
              <button type="button" className="filter-btn reset" onClick={handleReset}>
                重置
              </button>
              <button type="button" className="filter-btn confirm" onClick={handleConfirm}>
                确定
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

/**
 * 多选筛选函数 - 用于 filterFn
 */
export function multiSelectFilter<TData>(
  row: { getValue: (columnId: string) => unknown },
  columnId: string,
  filterValue: string[]
): boolean {
  if (!filterValue || filterValue.length === 0) return true;
  const value = String(row.getValue(columnId));
  return filterValue.includes(value);
}
