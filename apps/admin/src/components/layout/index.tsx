import type { ReactNode } from 'react';
import Content from './content';
import Header from './head';
import { logo, menuItems, title } from './helper';
import Sidebar, { type MenuItem } from './sidebar';

interface LayoutProps {
  logo?: ReactNode;
  title?: string;
  menuItems: MenuItem[];
  breadcrumbMap?: Record<string, string[]>;
}

function Layout(props: LayoutProps) {
  return (
    <div className="flex h-full w-full">
      {/* 侧边栏 */}
      <Sidebar
        logo={props.logo}
        title={props.title}
        menuItems={props.menuItems}
      />

      {/* 右侧主体区域 */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* 顶部导航 */}
        <Header
          className="h-12 shrink-0"
          menuItems={props.menuItems}
          breadcrumbMap={props.breadcrumbMap}
        />

        {/* 内容区域 */}
        <Content />
      </div>
    </div>
  );
}

export default function LayoutWrapper(){
  return <Layout logo={logo} title={title} menuItems={menuItems} />;
}

// export { default as Content } from './content';
// export { default as Header } from './head';
// export type { MenuItem } from './sidebar';
// export { default as Sidebar } from './sidebar';
