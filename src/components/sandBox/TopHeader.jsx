import React, { useEffect, useState } from "react";
import { Layout, Dropdown, Space, Menu, Avatar } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
// import PubSub from "pubsub-js";
import { connect } from "react-redux";
import {changeCollapsed} from '../../redux/action.js'
import axios from "axios";
const { Header } = Layout;

// UI组件
function SideHeader(props) {
  // 控制菜单栏的扩展与缩放
  const collapsed = props.collapsed
  const [title, setTitle] = useState('首页')
  const {username,role:{roleName}} = JSON.parse(localStorage.getItem('userInfo'))||{}
  const push = useNavigate()
  const {pathname} = useLocation()
  // useEffect(()=>{
  //   let timer = PubSub.subscribe('menuTitle',(_,title)=>{
  //     setTitle(title)
  //   },[])
  //   return ()=>{
  //     PubSub.unsubscribe(timer)
  //   }
  // })
  useEffect(()=>{
    axios('/rights').then(res=>{
      let til = res.data.find(item=>pathname.includes(item.key)).title
      // console.log(til);
      setTitle(til)
    })
  },[pathname])
  const onClick = ({ key }) => {
    if(key === 'logout'){
      localStorage.removeItem('token')
      push('/login')
    }
  };
  const menu = (
    <Menu
      onClick={onClick}
      items={[
        {
          label:roleName,
          key: "1",
        },
        {
          label: "退出",
          danger: true,
          key: "logout",
        },
      ]}
    />
  );
  return (
    <Header
      className="site-layout-background"
      style={{
        padding: 0,
      }}
    >
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: "trigger",
        onClick: () => props.changeCollapsed(!props.collapsed),
      })}
      <span className="title">{title}</span>
      <div style={{ display:'flex', float: "right" }}>
        <span style={{marginRight:'10px'}}>欢迎 <b>{username}</b> 回来</span>
        <Dropdown overlay={menu}>
            <Space>
              <Avatar src="https://joeschmoe.io/api/v1/random" />
            </Space>
        </Dropdown>
      </div>
    </Header>
  );
}

// 容器组件
export default connect(
  (state)=>({collapsed: state.CollapsedReducer.collapsed}),
  {
    changeCollapsed
  }
)(SideHeader)
