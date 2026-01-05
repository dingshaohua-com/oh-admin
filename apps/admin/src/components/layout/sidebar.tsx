import { cn } from '@repo/shadcn-comps/lib/utils';
import { ChevronDown } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router';

interface SidebarProps {
  className?: string;
  logo?: ReactNode;
  title?: string;
  menuItems: MenuItem[];
  defaultCollapsed?: boolean;
}

export interface MenuItem {
  key: string;
  label: string;
  icon: ReactNode;
  path?: string;
  children?: MenuItem[];
}

export default function Sidebar(props: SidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(props.defaultCollapsed ?? false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev);
  };

  const toggleSubmenu = (key: string) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const isMenuItemActive = (item: MenuItem): boolean => {
    if (item.path && location.pathname === item.path) {
      return true;
    }
    if (item.children) {
      return item.children.some((child) => isMenuItemActive(child));
    }
    return false;
  };

  const hasActiveChild = (item: MenuItem): boolean => {
    if (!item.children) return false;
    return item.children.some((child) => {
      if (child.path && location.pathname === child.path) {
        return true;
      }
      return hasActiveChild(child);
    });
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openKeys.includes(item.key);
    const isActive = item.path ? location.pathname === item.path : false;
    const hasActiveChildItem = hasActiveChild(item);

    if (hasChildren) {
      return (
        <div key={item.key}>
          <div
            onClick={() => toggleSubmenu(item.key)}
            className={cn(
              'flex items-center h-10 rounded cursor-pointer transition-all duration-200',
              'hover:bg-gray-100',
              collapsed ? 'mx-2 justify-center' : 'mx-4 px-4',
              hasActiveChildItem ? 'text-[#1890ff]' : 'text-gray-700'
            )}
          >
            <span className="shrink-0 flex items-center justify-center w-4">
              {item.icon}
            </span>
            {!collapsed && (
              <>
                <span className="ml-3 text-sm whitespace-nowrap flex-1">
                  {item.label}
                </span>
                <ChevronDown
                  className={cn(
                    'w-3 h-3 transition-transform duration-200',
                    isOpen && 'rotate-180'
                  )}
                />
              </>
            )}
          </div>
          {!collapsed && isOpen && (
            <div>
              {item.children?.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.key}
        to={item.path || '#'}
        className={cn(
          'flex items-center h-10 rounded transition-all duration-200',
          'hover:bg-gray-100',
          collapsed
            ? 'mx-2 justify-center'
            : level === 0
              ? 'mx-4 px-4'
              : 'ml-4 mr-4 pl-12 pr-4',
          isActive ? 'bg-[#e6f7ff] text-[#1890ff]' : 'text-gray-700'
        )}
      >
        <span className="shrink-0 flex items-center justify-center w-4">
          {item.icon}
        </span>
        {!collapsed && (
          <span className="ml-3 text-sm whitespace-nowrap">{item.label}</span>
        )}
      </Link>
    );
  };

  return (
    <div
      className={cn(
        'bg-white border-r border-gray-200 transition-all duration-200 flex flex-col h-full relative',
        collapsed ? 'w-12' : 'w-64',
        props.className
      )}
    >
      {/* Logo */}
      <div className={cn(
        'h-12 flex items-center shrink-0 overflow-hidden gap-2 border-b border-gray-50',
        collapsed ? 'justify-center px-0' : 'px-6'
      )}>
        {props.logo}
        {!collapsed && props.title && (
          <div className="text-lg font-semibold whitespace-nowrap text-gray-800">
            {props.title}
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        {props.menuItems.map((item) => renderMenuItem(item))}
      </nav>

      {/* Collapse Toggle Button - positioned on the right edge */}
      <button
        onClick={toggleCollapsed}
        className={cn(
          'absolute top-[72px] -right-[13px] w-[26px] h-[26px]',
          'bg-white border border-gray-200 rounded-full',
          'flex items-center justify-center',
          'hover:bg-gray-50 transition-colors',
          'shadow-sm z-10'
        )}
        aria-label="Toggle sidebar"
      >
        {collapsed ? (
          <ChevronDown className="w-3 h-3 text-gray-600 rotate-90" />
        ) : (
          <ChevronDown className="w-3 h-3 text-gray-600 -rotate-90" />
        )}
      </button>
    </div>
  );
}

