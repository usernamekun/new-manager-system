import React, { useEffect, useState } from "react";
import { Table, Button, Tag, notification } from "antd";
import {SmileOutlined} from '@ant-design/icons'
import axios from "axios";
import { useNavigate } from "react-router-dom";

const auditState = ["未审核", "审核中", "已通过", "未通过"];
const color = ["red", "gold", "green", "red"];
const buttonText = ["", "撤销", "发布", "修改"];
const buttonType = ["", "", "primary", "danger"];
export default function DraftNews() {
  const [dataSource, setdataSource] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("userInfo"));
  const push = useNavigate();
  useEffect(() => {
    // 获取到提交审核 还没有发布的内容 也就是auditState!=0&&publishState<=1
    axios
      .get(
        `http://localhost:8000/news?auditState_ne=0&publishState_lte=1&author=${username}&_expand=category`
      )
      .then((res) => {
        setdataSource(res.data);
      });
  }, [username]);
  const handlerButton = (row, flag) => {
    // 发布按钮
    if (flag === 2 || flag === 1) {
      axios.patch(`http://localhost:8000/news/${row.id}`, {
        auditState: flag === 1 ? 0 : flag,
        publishState: flag === 2 ? 2 : 0,
        publishTime: flag === 2 ? Date.now() : null,
      }).then((res)=>{
        push(flag===2&&'/publish-manage/published')
        notification.open({
          message: flag===2?'发布成功':'撤销成功',
          description:
            `你可以在${flag===2?'【发布管理/已发布】':' 【新闻管理/草稿箱】'}中查看你的文章`,
          icon: (
            <SmileOutlined
              style={{
                color: '#108ee9',
              }}
            />
          ),
        });
        let data = dataSource.filter(item=>item.id!==row.id)
        setdataSource(data)
      })
    }
    if (flag === 3) {
      push(`/news-manage/update/${row.id}`);
    }
  };
  const columns = [
    {
      title: "新闻标题",
      render: (row) => (
        <Button
          onClick={() => push(`/news-manage/preview/${row.id}`)}
          type="link"
          style={{ padding: 0 }}
        >
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
      title: "审核状态",
      dataIndex: "auditState",
      render: (text) => <Tag color={color[text]}>{auditState[text]}</Tag>,
    },
    {
      title: "操作",
      render: (row) => (
        row.auditState>1?<Button
          onClick={() => handlerButton(row, row.auditState)}
          type={buttonType[row.auditState]}
        >
          {buttonText[row.auditState]}
        </Button>:<Button onClick={() => handlerButton(row, row.auditState)} danger>撤销</Button>
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
