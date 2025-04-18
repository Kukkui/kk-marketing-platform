// const CampaignListsPage: React.FC = () => {
//   return (
//     <div className="flex flex-col h-full">
//       HOME
//     </div>
//   );
// }

// export default CampaignListsPage;

'use client';

import React, { useState } from 'react';
import { AppstoreOutlined, ContainerOutlined, DesktopOutlined, MailOutlined, PieChartOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import Image from 'next/image';
import SideBarMenu from '@/components/SidebarMenu';
import ContentSelector from '@/components/ContentSelector';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'campaign',
    label: 'Capaign',
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
    console.log('click ', e);
    
    const menuTitle = e?.key;

    setMenu(menuTitle);
  };

  return (
    <>
    <div style={{ display: 'flex', height: '100vh' }}>
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