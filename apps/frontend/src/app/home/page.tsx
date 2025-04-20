'use client';

import React, { useState } from 'react';
import { AppstoreOutlined, DesktopOutlined, PieChartOutlined, PlusOutlined, RobotOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import SideBarMenu from '@/components/SidebarMenu';
import ContentSelector from '@/components/ContentSelector';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'campaign',
    label: 'Campaign',
    icon: <AppstoreOutlined />,
    children: [
      { key: 'campaign_list', icon: <DesktopOutlined />, label: 'Campaign Lists' },
      { key: 'create_email_campaign', icon: <PieChartOutlined />, label: 'Create Email Campaign' },
    ],
  },
  {
    key: 'audience',
    label: 'Audience',
    icon: <TeamOutlined/>,
    children: [
      { key: 'audience_list', icon: <DesktopOutlined />, label: 'Audience Lists' },
      { key: 'create_audience', icon: <PieChartOutlined />, label: 'Create Audiences' },
    ],
  },
  {
    key: 'automation',
    label: 'Automation',
    icon: <RobotOutlined/>,
    children: [
      { key: 'automation_list', icon: <SettingOutlined />, label: 'Automation Lists' }, // SettingOutlined for a list/settings-like icon
      { key: 'create_automation', icon: <PlusOutlined />, label: 'Create Automation' }, // PlusOutlined for creation
    ],
  }
  // {
  //   type: 'divider',
  // },
  // {
  //   key: 'sub4',
  //   label: 'Navigation Three',
  //   icon: <SettingOutlined />,
  //   children: [
  //     { key: '9', label: 'Option 9' },
  //     { key: '10', label: 'Option 10' },
  //     { key: '11', label: 'Option 11' },
  //     { key: '12', label: 'Option 12' },
  //   ],
  // },
  // {
  //   key: 'grp',
  //   label: 'Group',
  //   type: 'group',
  //   children: [
  //     { key: '13', label: 'Option 13' },
  //     { key: '14', label: 'Option 14' },
  //   ],
  // },
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