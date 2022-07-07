import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, message, notification } from 'antd'
import { EditOutlined, DeleteOutlined,ExclamationCircleOutlined,UploadOutlined,SmileOutlined} from '@ant-design/icons'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function DraftNews() {
  const [dataSource, setdataSource] = useState([])
  const {username} = JSON.parse(localStorage.getItem('userInfo'))
  const push = useNavigate()
  // 删除操作，暂时不和后台交互
  const deleteRole = (row) => {
    axios.delete(`http://localhost:8000/news/${row.id}`).then(res=>{
      // 删除成功 重新渲染页面 
      // 两种方式 一、重新调用接口 二、手动渲染删除后的页面
      let data = dataSource.filter(item=>item.id!==row.id)
      setdataSource(data)
      message.success('删除成功')
    })
  }
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
  // 上传
  const onLoad = (row) => {
    axios.patch(`http://localhost:8000/news/${row.id}`,{
      "auditState": 1,
      createTime: Date.now()
    }).then(()=>{
      notification.open({
        message: '上传成功',
        description:
          `你可以在审核列表中查看你的文章`,
        icon: (
          <SmileOutlined
            style={{
              color: '#108ee9',
            }}
          />
        ),
      });
      // 刷新页面
      let data = dataSource.filter(item=>item.id!==row.id)
      setdataSource(data)
    })
  }
  useEffect(()=>{
    // 获取当前用户角色的草稿箱的列表
    axios.get(`http://localhost:8000/news?_expand=category&auditState=0&author=${username}`).then(res=>{
      setdataSource(res.data)
    })
  },[username])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (text) => <b>{text}</b>,
    },
    {
      title: '标题',
      // dataIndex: 'title',
      render: (row) => <Button onClick={()=>push(`/news-manage/preview/${row.id}`)} style={{padding:'0'}} type='link'>{row.title}</Button>
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      render: (row) => row.category.title
    },
    {
      title: '操作',
      render: (row)=>(
        <span>
          <Button
            danger
            shape="circle"
            icon={<DeleteOutlined onClick={() => confirm(row)} />}
          />
          &nbsp;&nbsp;
          <Button
              shape="circle"
              onClick={()=>push(`/news-manage/update/${row.id}`)}
              icon={<EditOutlined />}
            />&nbsp;&nbsp;
          <Button
              type="primary"
              shape="circle"
              onClick={()=>onLoad(row)}
              icon={<UploadOutlined />}
            />
        </span>
      )
      
    }
  ];
  return (
    <Table pagination={{pageSize:5}} columns={columns} dataSource={dataSource} rowKey={(row)=>row.id}/>
  )
}
