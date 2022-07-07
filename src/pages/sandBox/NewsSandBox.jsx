import { Layout } from "antd";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import SideMenu from "../../components/sandBox/SideMenu";
import TopHeader from "../../components/sandBox/TopHeader";
import "./index.css";
import { Spin } from "antd";
import { connect } from "react-redux";
const { Content } = Layout;
function NewsSandBox(props) {
  // const [spinning] = useState(false) 
  nProgress.start();
  useEffect(() => {
    nProgress.done();
  });
  return (
    <Layout>
      <SideMenu />
      <Layout className="site-layout">
        <TopHeader />
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflow: "auto",
          }}
        >
          <Spin size="large" tip='loading' spinning={props.spining}>
            <Outlet />
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
}
const mapStateToProps = (state) =>{
  return {spining: state.LoadingReducer.spining}
}
export default connect(mapStateToProps)(NewsSandBox)