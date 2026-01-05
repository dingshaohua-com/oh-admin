import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@repo/shadcn-comps/dropdown-menu';
import { cn } from '@repo/shadcn-comps/lib/utils';
import { Bell, ChevronRight, LogOut, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import type { MenuItem } from './sidebar';

interface HeaderProps {
  className?: string;
  menuItems?: MenuItem[];
  breadcrumbMap?: Record<string, string[]>;
}

export default function Header(props: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 从菜单结构中推导面包屑
  const getBreadcrumbsFromMenu = (pathname: string): string[] => {
    const breadcrumbs: string[] = ['首页'];
    
    const findPath = (items: MenuItem[], path: string, parents: string[] = []): string[] | null => {
      for (const item of items) {
        if (item.path === path) {
          return [...parents, item.label];
        }
        if (item.children) {
          const result = findPath(item.children, path, [...parents, item.label]);
          if (result) return result;
        }
      }
      return null;
    };
    
    if (props.menuItems) {
      const path = findPath(props.menuItems, pathname);
      if (path) {
        breadcrumbs.push(...path);
      }
    }
    
    return breadcrumbs;
  };
  
  // 优先使用自定义面包屑映射，否则从菜单推导
  const breadcrumbs = props.breadcrumbMap?.[location.pathname] 
    || getBreadcrumbsFromMenu(location.pathname);

  return (
    <div
      className={cn(
        'bg-white border-b border-gray-200 px-6 py-2 flex items-center justify-between shadow-sm',
        props.className
      )}
    >
      {/* 左侧：面包屑 */}
      <div className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
            <span
              className={cn(
                index === breadcrumbs.length - 1
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-500'
              )}
            >
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* 右侧操作区 */}
      <div className="flex items-center gap-2">
        {/* 通知 */}
        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* 用户信息 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-2 rounded transition-colors">
              <div className="w-6 h-6 bg-[#1890ff] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-700">Admin</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                // 清除登录状态
                localStorage.removeItem('token');
                // 跳转到登录页
                navigate('/login');
              }}
            >
              <LogOut className="w-4 h-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

