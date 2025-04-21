'use client';

import React, { useState } from 'react';
import { DashboardOutlined, MailOutlined, PlusCircleOutlined, RobotOutlined, UnorderedListOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import SideBarMenu from '@/components/SidebarMenu';
import ContentSelector from '@/components/ContentSelector';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardOutlined />, // Better for dashboard.
  },
  {
    key: 'campaign',
    label: 'Campaign',
    icon: <MailOutlined />, // Mail for campaigns.
    children: [
      {
        key: 'campaign_list',
        icon: <UnorderedListOutlined />,
        label: 'Campaign Lists', // List icon.
      },
      {
        key: 'create_email_campaign',
        icon: <PlusCircleOutlined />,
        label: 'Create Email Campaign', // Creation icon.
      },
    ],
  },
  {
    key: 'audience',
    label: 'Audience',
    icon: <UsergroupAddOutlined />, // People icon for audience
    children: [
      {
        key: 'audience_list',
        icon: <UnorderedListOutlined />,
        label: 'Audience Lists',
      },
      {
        key: 'create_audience',
        icon: <PlusCircleOutlined />,
        label: 'Create Audiences',
      },
    ],
  },
  {
    key: 'automation',
    label: 'Automation',
    icon: <RobotOutlined />, // Robot icon for automation
    children: [
      {
        key: 'automation_list',
        icon: <UnorderedListOutlined />,
        label: 'Automation Lists',
      },
      {
        key: 'create_automation',
        icon: <PlusCircleOutlined />,
        label: 'Create Automation',
      },
    ],
  },
];

const App: React.FC = () => {
  const [menu, setMenu] = useState<string>('');

  const onClick: MenuProps['onClick'] = (e) => {    
    const menuTitle = e?.key;

    setMenu(menuTitle);
  };

  return (
    <>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '20% 80%', // Sidebar 20%, Content 80%
        height: '100vh',
      }}
    >
      {/* SIDEBAR */}
      <SideBarMenu
        onClick={onClick}
        items={items}
      />

      {/* CONTENT */}
      <ContentSelector menu={menu} />
    </div>
    </>
  );
};

export default App;