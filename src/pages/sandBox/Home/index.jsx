import React, { useEffect, useRef, useState } from "react";
import { Row, Card, Col, Button, List, Avatar } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PubSub from "pubsub-js";
import * as echarts from "echarts";
import _ from "loadsh";
import MyData from "../../../components/MyData/MyData";
// const compareView = (obj1, obj2) => {
//   if (obj1.view < obj2.view) {
//     return 1;
//   } else if (obj1.view > obj2.view) {
//     return -1;
//   } else {
//     return 0;
//   }
// };
// const compareStar = (obj1, obj2) => {
//   if (obj1.star < obj2.star) {
//     return 1;
//   } else if (obj1.star > obj2.star) {
//     return -1;
//   } else {
//     return 0;
//   }
// };
const { Meta } = Card;
export default function Home() {
  const [viewList, setviewList] = useState([]);
  const [starList, setstarList] = useState([]);
  const [allList, setAllList] = useState([])
  const {
    username,
    region,
    role: { roleName },
  } = JSON.parse(localStorage.getItem("userInfo"));
  const push = useNavigate();
  useEffect(() => {
    axios
      .get("/news?publishState=2&_sort=view&_order=desc&_limit=6")
      .then((res) => {
        setviewList(res.data);
      });
    axios
      .get("/news?publishState=2&_sort=star&_order=desc&_limit=6")
      .then((res) => {
        setstarList(res.data);
      });
    // axios.get("/news?publishState=2").then((res) => {
    //   // 浅拷贝
    //   let view = [...res.data];
    //   let star = [...res.data];
    //   view = view.sort(compareView);
    //   star = star.sort(compareStar);
    //   setviewList(view.slice(0, 6));
    //   setstarList(star.slice(0, 6));
    // });
  }, []);
  const preview = (id) => {
    push(`/news-manage/preview/${id}`);
  };

  const mainRef = useRef(null);
  useEffect(() => {
    axios("/news?publishState=2&_expand=category").then((res) => {
      renderEcharts(_.groupBy(res.data, (item) => item.category.title));
      setAllList(res.data)
    });
  }, []);
  const renderEcharts = (arrObj) => {
    let Xdata = Object.keys(arrObj);
    let Ydata = Object.values(arrObj);
    Ydata = Ydata.map((item) => item.length);
    var myChart = echarts.init(mainRef.current);
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: "ECharts 入门示例",
      },
      tooltip: {},
      legend: {
        data: ["销量"],
      },
      xAxis: {
        data: Xdata,
      },
      yAxis: {
        minInterval: 1,
      },
      series: [
        {
          name: "销量",
          type: "bar",
          data: Ydata,
        },
      ],
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
      // window.onresize = () => {
      //   myChart.resize()
      // };
  };
  const onenDrawer = () =>{
    PubSub.publish('visible',true)
  }
  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="small"
              split
              dataSource={viewList}
              renderItem={(list) => (
                <List.Item style={{ padding: "8px 0" }}>
                  <Button
                    onClick={() => preview(list.id)}
                    style={{ padding: "0" }}
                    type="link"
                  >
                    {list.title}
                  </Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              split
              dataSource={starList}
              renderItem={(list) => (
                <List.Item style={{ padding: "8px 0" }}>
                  <Button
                    onClick={() => preview(list.id)}
                    style={{ padding: "0" }}
                    type="link"
                  >
                    {list.title}
                  </Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            // style={{height:'400.14px'}}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined onClick={onenDrawer} key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                  <b>{region ? region : "全球"}</b>
                  <span style={{ fontSize: "13px", marginLeft: "5px" }}>
                    {roleName}
                  </span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <MyData allList={allList}/>
      <div ref={mainRef} style={{ width: "600px", height: "400px" }}></div>
    </div>
  );
}
