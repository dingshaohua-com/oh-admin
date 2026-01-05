import {
  Crown,
  FileText,
  LayoutDashboard,
  Settings,
  Shield,
  UserCog,
  Users,
} from 'lucide-react';
import type {  MenuItem } from './sidebar';

export const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    icon: <LayoutDashboard className="w-4 h-4" />,
    path: '/',
  },
  {
    key: 'users',
    label: '用户管理',
    icon: <Users className="w-4 h-4" />,
    path: '/users',
  },
  // {
  //   key: 'content',
  //   label: '内容管理',
  //   icon: <FileText className="w-4 h-4" />,
  //   path: '/content',
  // },
  // {
  //   key: 'settings',
  //   label: '系统设置',
  //   icon: <Settings className="w-4 h-4" />,
  //   children: [
  //     {
  //       key: 'settings-general',
  //       label: '基本设置',
  //       icon: <UserCog className="w-4 h-4" />,
  //       path: '/settings',
  //     },
  //     {
  //       key: 'settings-security',
  //       label: '安全设置',
  //       icon: <Shield className="w-4 h-4" />,
  //       path: '/settings/security',
  //     },
  //   ],
  // },
];

export const logo = <Crown className="w-8 h-8 text-[#1890ff] shrink-0" />;
export const title = 'xxAdmin';