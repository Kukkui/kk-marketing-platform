import { SettingOutlined } from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";

type MenuItem = Required<MenuProps>["items"][number];

const SideBarMenu = (props: {
  onClick: MenuProps["onClick"];
  items: MenuItem[];
}) => {
  const { onClick, items } = props;
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear(); // Clear local storage
    router.push("/login"); // Redirect to login page
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#001529",
        color: "white",
        userSelect: "none",
        display: "flex",
        flexDirection: "column", // Stack children vertically
      }}
    >
      {/* Scrollable Section: Logo + Menu */}
      <div
        style={{
          flex: 1, // Take remaining space
          overflowY: "auto", // Scrollable upper part
        }}
      >
        {/* ICON/LOGO */}
        <div
          style={{
            padding: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "clamp(10px, 10vw, 150px)", // Responsive width
              height: "clamp(10px, 10vw, 150px)", // Responsive height
              borderRadius: "50%",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden", // Ensures the image stays within the circle
            }}
          >
            <Image src="/icon/test.png" height={150} width={150} alt="icon" />
          </div>
        </div>

        {/* MENU */}
        <Menu
          onClick={onClick}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
          items={items}
        />
      </div>

      {/* FOOTER */}
      <div
        style={{
          padding: "10px 24px", // Match menu's left padding (24px is Ant Design's default)
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start", // Align slightly to the left
        }}
        onClick={handleLogout}
      >
        <SettingOutlined style={{ fontSize: "20px", color: "white" }} />
        <span
          style={{
            marginLeft: "10px",
            color: "white",
            fontSize: "14px", // Match Ant Design menu item text size
          }}
        >
          Logout
        </span>
      </div>
    </div>
  );
};

export default SideBarMenu;