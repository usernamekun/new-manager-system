import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  AuditOutlined,
  ContainerOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import axios from "axios";
// import Pubsub from 'pubsub-js'
import "./index.css";
import { connect } from "react-redux";
const { Sider } = Layout;
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
// 图标数组
const iconList = {
  "/home": <MailOutlined />,
  "/user-manage": <AppstoreOutlined />,
  "/right-manage": <SettingOutlined />,
  "/news-manage": <ContainerOutlined />,
  "/audit-manage": <AuditOutlined />,
  "/publish-manage": <PushpinOutlined />,
};

 function SideMenu(props) {
  const collapsed = props.collapsed
  // 菜单
  const [menus, setMenu] = useState([]);
  // 获取当前的路径path
  const {pathname} = useLocation()
  // 获得上一级路径
  const firstPath = '/'+pathname.split('/')[1]
  // 获取菜单列表
  useEffect(() => {
    axios.get("http://localhost:8000/rights?_embed=children").then((res) => {
      setMenu(res.data);
    });
  }, []);
  // 获取用户信息
  const {role:{rights}} = JSON.parse(localStorage.getItem('userInfo'))
  // 判断是否有pagepermisson字段和当前登录账号的权限列表 来显示菜单栏
  const isShowMenu = (item) => item.pagepermisson === 1&&rights.includes(item.key);
  // 动态渲染菜单栏
  const items = menus.map((item) => {
    if (item.children.length !== 0 && isShowMenu(item)) {
      return getItem(
        item.title,
        item.key,
        iconList[item.key],
        item.children.map((i) => {
          return isShowMenu(i) && getItem(i.title, i.key);
        })
      );
    }
    return (
      isShowMenu(item) && getItem(item.title, item.key, iconList[item.key])
    );
  });
  const push = useNavigate();
  // 编程式导航  点击菜单栏跳转对应的页面
  function pushTo({ key }) {
    // let data = menus.find(item=>key.includes(item.key))
    // Pubsub.publish('menuTitle',data.title)
    push(key);
  }
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div style={{height:'100%',display:'flex',flexDirection:'column'}}>
        <div className="logo" style={{ display: collapsed ? "none" : "block" }}>
          全球新闻发布系统
        </div>
        <div style={{overflow:'auto'}}>
        <Menu
          onClick={pushTo}
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          defaultOpenKeys={[firstPath]}
          items={items}
        />
        </div>
      </div>
    </Sider>
  );
}

export default connect(
  state=>({collapsed: state.CollapsedReducer.collapsed})
)(SideMenu)