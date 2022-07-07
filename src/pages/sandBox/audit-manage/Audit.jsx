import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { Button, message, Table } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const roleName = {
  1: "超级管理员",
  2: "区间管理员",
  3: "区间编辑",
};
export default function Audit() {
  const [dataSource, setdataSource] = useState([]);
  const { username, roleId, region } = JSON.parse(
    localStorage.getItem("userInfo")
  );
  const push = useNavigate()
  useEffect(() => {
    // 根据当前登录的身份权限，超级管理员可以审核所有人，而其它只能审核比自己低的
    axios("http://localhost:8000/news?auditState=1&_expand=category").then(
      (res) => {
        // 只要不是超级管理员 就只能审核自己区域和等级低的列表
        setdataSource(
          roleName[roleId] === "超级管理员"
            ? res.data
            : res.data.filter(
                (item) =>
                  item.author === username ||
                  (item.region === region
                    ? region
                    : "全球" && roleName[item.roleId] === "区间编辑")
              )
        );
      }
    );
  }, [username, region, roleId]);
  const gotoPreview = (id) => {
    push(`/news-manage/preview/${id}`)
  }
  // flag  1 通过  0  通过
  const checkHandler = (id,auditState,publishState) => {
    axios.patch(`http://localhost:8000/news/${id}`,{
      auditState,
      publishState
    }).then(res=>{
      let data = dataSource.filter(item=>item.id!==id)
      setdataSource(data)
      message.success('操作成功')
    })
  }
  const columns = [
    {
      title: "新闻标题",
      render: (row) => (
        <Button style={{ padding: 0 }} type="link" onClick={()=>gotoPreview(row.id)}>
          {row.title}
        </Button>
      ),
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "新闻分类",
      render: (row) => row.category.title,
    },
    {
      title: "操作",
      render: (row) => (
        <Fragment>
          <Button onClick={()=>checkHandler(row.id,2,1)} shape="circle" type="primary" icon={<CheckOutlined />} />&nbsp;
          <Button onClick={()=>checkHandler(row.id,3,0)} shape="circle" type="danger" icon={<CloseOutlined />} />
        </Fragment>
      ),
    },
  ];
  return (
    <Table
      pagination={{ pageSize: 5 }}
      columns={columns}
      dataSource={dataSource}
      rowKey={(row) => row.id}
    />
  );
}
