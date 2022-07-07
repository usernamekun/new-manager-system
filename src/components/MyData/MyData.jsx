import React, { useEffect, useRef, useState } from "react";
import { Drawer } from "antd";
import PubSub from "pubsub-js";
import * as echarts from "echarts";
import _ from 'loadsh'
export default function MyData(props) {
  const [visible, setvisible] = useState(false);
  // const [newsList,setNewsList] = useState([])
  const pieRef = useRef(null);
  const {username} = JSON.parse(localStorage.getItem('userInfo'))
  useEffect(() => {
    let timer = PubSub.subscribe("visible", (__, value) => {
      let data = props.allList.filter(item=>item.author===username)
      setvisible(value);
      setTimeout(() => {
        renderEcharts(_.groupBy(data,item=>item.category.title))
      }, 0);
    });
    return () => {
      PubSub.unsubscribe(timer);
    };
  }, [props.allList,username]);
  // useEffect(()=>{
    
  //   console.log(data);
  // })
  const onClose = () => {
    setvisible(false);
  };
  const renderEcharts = (obj) => {
    let list = []
    for(var name in obj){
      list.push({name,value:obj[name].length})
    }
    console.log(list);
    var myChart = pieRef&&echarts.init(pieRef.current);
    let option = {
      title: {
        text: "当前用户新闻分类图示",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: "50%",
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    option&&myChart.setOption(option);
  };
  
  return (
    <Drawer
      title="个人新闻分类"
      width={500}
      placement="right"
      onClose={onClose}
      visible={visible}
    >
      <div ref={pieRef} style={{ width: "600px", height: "400px" }}></div>
    </Drawer>
  );
}
