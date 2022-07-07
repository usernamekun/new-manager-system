import { Table, Button, Modal, message,Tree } from "antd";
import {
  DeleteOutlined,
  MenuFoldOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function RoleList() {
  let [dataSource, setDataSource] = useState([]);
  let [isModalVisible, setIsModalVisible] = useState(false);
  let [treeData,setTreeData] = useState([]) 
  let [currentRight,setCurrentRight] = useState([])
  let [currentId,setCurrentId] = useState(0)
  // 获取角色列表
  useEffect(() => {
    axios.get("http://localhost:8000/roles").then((res) => {
      setDataSource(res.data);
      axios.get('http://localhost:8000/rights?_embed=children').then(res=>{
        setTreeData(res.data)
      })
    });
  }, []);
  // useEffect(()=>{
  //     axios.get('http://localhost:8000/rights?_embed=children').then(res=>{
  //       setTreeData(res.data)
  //     })
  // },[])
  // 删除操作，暂时不和后台交互
  const deleteRole = (row) => {
    let data = dataSource.filter((item) => item.id !== row.id);
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
  // 编辑操作
  const changeTree = (row)=>{
    setIsModalVisible(true)
    setCurrentRight([...row.rights])
    setCurrentId(row.id)
  }
  // 
  const onCheck = (checkKeys)=>{
    setCurrentRight(checkKeys)
  }
  const handleOk = () => {
    // 方式一 改变数组中对象的一个属性 
    // var data = dataSource.filter(item=>{
    //   return item.id===currentId
    // })
    // data[0].rights = currentRight
    dataSource = dataSource.map(item=>{
      if(item.id===currentId){
        // 浅拷贝 修改数据
        return {...item,rights:currentRight}
      }
      return item
    })
    setDataSource([...dataSource])
    // 通知后台更改数据
    axios.patch(`http://localhost:8000/roles/${currentId}`,{
      rights: currentRight
    })
    setIsModalVisible(false)
  }
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
    },
    {
      title: "操作",
      render: (row) => (
        <span>
          <Button
            danger
            shape="circle"
            icon={<DeleteOutlined onClick={() => confirm(row)} />}
          />
          &nbsp;&nbsp;
          <Button
            type="primary"
            shape="circle"
            onClick={() => changeTree(row)}
            icon={<MenuFoldOutlined />}
          />
          <Modal
            title="权限分配"
            visible={isModalVisible}
            onOk={()=>handleOk(row)}
            onCancel={() => setIsModalVisible(false)}
          >
            <Tree
              checkable
              // expandedKeys={currentRight}
              checkedKeys={currentRight}
              onCheck={onCheck}
              treeData={treeData}
            />
          </Modal>
        </span>
      ),
    },
  ];
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey={(item) => item.id}
    />
  );
}
