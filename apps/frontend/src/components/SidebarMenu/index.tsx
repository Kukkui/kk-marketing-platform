import { Menu, MenuProps } from "antd"
import Image from "next/image"
type MenuItem = Required<MenuProps>['items'][number];

const SideBarMenu = (props: {
    onClick: MenuProps['onClick']
    items: MenuItem[]
}) => {
    const { onClick, items } = props
    return (
        <div style={{ 
            width: 256, 
            height: '100vh', 
            overflowY: 'auto', 
            backgroundColor: '#001529', 
            color: 'white', 
            userSelect: 'none' // Make sure text is not selectable
            }}>
            {/* ICON/LOGO */}
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden', // Ensures the image stays within the circle
                }}
              >
                <Image src="/icon/test.png" height={150} width={150} alt="icon" />
              </div>
            </div>
    
            {/* MENU */}
            <Menu
              onClick={onClick}
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              mode="inline"
              theme="dark"
              items={items}
            />
          </div>
    )
}

export default SideBarMenu;