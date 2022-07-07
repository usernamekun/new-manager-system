import React, { useEffect, useRef, useState } from "react";
import { Table, Button, Popconfirm, message, Input } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import axios from "axios";
export default function CategoryNews() {
  const [dataSource, setdataSource] = useState([]);
  const inputRef = useRef(null);
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    axios("http://localhost:8000/categories").then((res) => {
      res.data = res.data.map((item) => {
        // showState 0不展示input  1 展示input
        item.showState = 0;
        return item;
      });
      setdataSource(res.data);
    });
  }, []);
  // 自动获取焦点
  useEffect(() => {
    if (edit) {
      inputRef.current.focus();
    }
  }, [edit]);
  const clear = (id) => {
    // axios.delete(`http://localhost:8000/categories/${id}`).then(() => {
    setdataSource(dataSource.filter((item) => item.id !== id));
    message.success("删除成功！");
    // });
  };
  // 点击span 切换input框
  const InputShow = (row) => {
    dataSource.forEach((item) => {
      if (item.id === row.id) {
        item.showState = 1;
      }
    });
    setEdit(true);
  };
  const changeData = (row,e)=>{
    dataSource.forEach((item) => {
      if (item.id === row.id) {
        item.title = e.target.value;
        item.value = e.target.value
        item.showState = 0;
      }
    });
    setEdit(false);
  }
  // 更改新闻标题 失去焦点和按下enter键触发
  const changeTitle = (row, e) => {
    // 如果内容没改就不发请求  减少消耗
    if(row.title === e.target.value) {
      changeData(row,e)
      return
    }
    axios
      .patch(`http://localhost:8000/categories/${row.id}`, {
        title: e.target.value,
        value: e.target.value,
      })
      .then(() => {
        changeData(row,e)
      });
      
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 120,
      render: (id) => <b>{id}</b>,
    },
    {
      title: "栏目名称",
      // width: 350,
      render: (row) =>
        !row.showState ? (
          <span onClick={() => InputShow(row)} style={{ display: "block" }}>
            {row.title}
          </span>
        ) : (
          <Input
            ref={inputRef}
            onPressEnter={(e) => changeTitle(row, e)}
            onBlur={(e) => changeTitle(row, e)}
            defaultValue={row.title}
          />
        ),
    },
    {
      title: "操作",
      width: 180,
      render: (row) => (
        <Popconfirm
          title="你确定要删除嘛？"
          onConfirm={() => clear(row.id)}
          onCancel={() => message.info("操作取消")}
          okText="确定"
          cancelText="取消"
        >
          <Button
            icon={<ClearOutlined />}
            type="primary"
            danger
            shape="circle"
          ></Button>
        </Popconfirm>
      ),
    },
  ];
  return (
    <Table dataSource={dataSource} columns={columns} rowKey={(row) => row.id} />
  );
}
