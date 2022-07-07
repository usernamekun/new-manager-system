import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Modal, message, Popover, Switch } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
export default function RightList() {
  const [dataSource, setDataSource] = useState([]);
  // 删除操作，暂时不和后台交互
  const deleteRole = (row) => {
    let data = dataSource;
    if (row.grade === 1) {
      data = data.filter((item) => item.id !== row.id);
    } else if (row.grade === 2) {
      let rowData = data.find((item) => item.id === row.rightId);
      rowData.children = rowData.children.filter((item) => item.id !== row.id);
    }
    setDataSource([...data]);
    message.success("删除成功!");
  };
  // 点击删除弹出框
  const confirm = (row) => {
    Modal.confirm({
      title: "你确定要删除嘛",
      icon: <ExclamationCircleOutlined />,
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        deleteRole(row);
      },
    });
  };
  const switchMethod = (row) => {
    row.pagepermisson = row.pagepermisson === 1?0:1
    // 强制刷新页面
    setDataSource([...dataSource])
    // 给后端发消息更改数据
    if(row.grade === 1){
      axios.patch(`http://localhost:8000/rights/${row.id}`,{
        pagepermisson:row.pagepermisson
      })
    }else{
      axios.patch(`http://localhost:8000/children/${row.id}`,{
        pagepermisson:row.pagepermisson
      })
    }
  }
  // 编辑操作
  const edit = () => {
  };

  const content = (row)=> (
    <div style={{textAlign:'center'}}>
      <Switch checked={row.pagepermisson} onChange={()=>switchMethod(row)}/>
    </div>
  )
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      align: "center",
      render: (id) => <b>{id}</b>,
    },
    {
      title: "权限名称",
      align: "center",
      dataIndex: "title",
    },
    {
      title: "权限路径",
      align: "center",
      dataIndex: "key",
      render: (text) => <Tag color="success">{text}</Tag>,
    },
    {
      title: "操作",
      align: "center",
      render: (row) => (
        <span>
          <Button
            danger
            shape="circle"
            icon={<DeleteOutlined onClick={() => confirm(row)} />}
          />
          &nbsp;&nbsp;
          <Popover content={()=>content(row)} title='配置项' trigger={row.pagepermisson===undefined?'':'click'}>
            <Button
              type="primary"
              shape="circle"
              onClick={edit}
              icon={<EditOutlined />}
              disabled={row.pagepermisson===undefined}
            />
          </Popover>
        </span>
      ),
    },
  ];

  useEffect(() => {
    axios.get("http://localhost:8000/rights?_embed=children").then((res) => {
      let list = res.data;
      list = list.map((item) => {
        if (item.children.length === 0) {
          item.children = "";
        }
        return item;
      });
      setDataSource(list);
    });
  }, []);

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={{ pageSize: 5 }}
    />
  );
}
