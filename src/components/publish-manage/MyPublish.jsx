import React from "react"; 
import { Table, Button, Popconfirm,message } from "antd";
import { useNavigate } from "react-router-dom";

// 公共组件
export default function DraftNews(props) {
  
  const {ButtonText,ButtonType,isDanger,handlerState,dataSource,handlerButton,button} = props
  const push = useNavigate()
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
      title: "操作",
      render: (row) => (
        ButtonText?<Popconfirm
          title={`你确定要${ButtonText}嘛？`}
          onConfirm={() => handlerButton(row.id,handlerState)}
          onCancel={() => message.info("操作取消")}
          okText="确定"
          cancelText="取消"
        >
          {isDanger?<Button type={ButtonType} danger>{ButtonText}</Button>
            :<Button danger>{ButtonText}</Button>
          }
        </Popconfirm>:button(row.id)
      ),
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey={(row) => row.id}
    />
  );
}
