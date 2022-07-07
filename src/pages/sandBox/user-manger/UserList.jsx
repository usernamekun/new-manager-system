import { Table, Button, Modal, message, Switch, Form } from "antd";
import {
  DeleteOutlined,
  MenuFoldOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";

import UserForm from "../../../components/user-manager/UserForm";
export default function RoleList() {
  let [dataSource, setDataSource] = useState([]);
  let [isUpdateVisible, setisUpdateVisible] = useState(false);
  let [visible, setvisible] = useState(false);
  let [regionList, setRegionList] = useState([]);
  let [roleList, setRoleList] = useState([]);
  let [updataIsDisabled, setupdataIsDisabled] = useState(false);
  let [currentId, setCurrentId] = useState(0);
  let [currentRoleId, setCurrentRoleId] = useState(0);
  let [currentRegion, setCurrentRegion] = useState("");
  let { roleId, region, id } =
    JSON.parse(localStorage.getItem("userInfo")) || {};
  const handlerDataSource = useCallback((data) =>{
    if (roleId !== 1) {
      data = data.filter((item) => item.id===id||(item.region===region&&item.roleId>roleId))
    }
    return data
  },[roleId, region, id])
  // 获取角色列表
  useEffect(() => {
    axios.get("http://localhost:8000/users?_expand=role").then((res) => {
      // 对角色来选择展示列表
      // 如果是超级管理员身份可以展示所有 不是就只能展示当前身份和当前地区相同的等级身份低的
      // if (roleId !== 1) {
      //   res.data = res.data.filter(
      //     (item) =>
      //       item.id === id || (item.region === region && item.roleId > roleId)
      //   );
      // }
      res.data = handlerDataSource(res.data)
      setDataSource(res.data);
    });
  }, [ handlerDataSource]);
  useEffect(()=>{
    axios.get("http://localhost:8000/regions").then((res) => {
      setRegionList(res.data);
    });
  },[])
  useEffect(()=>{
    axios.get("http://localhost:8000/roles").then((res) => {
      setRoleList(res.data);
    });
  },[])
  // 删除操作
  const deleteRole = (row) => {
    let data = dataSource.filter((item) => item.id !== row.id);
    axios.delete(`http://localhost:8000/users/${row.id}`);
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
  const edit = (row) => {
    setCurrentRoleId(row.roleId);
    setCurrentRegion(row.region);
    setCurrentId(row.id);
    const { username, password, region, roleId } = row;
    updateform.setFieldsValue({
      username,
      password,
      region,
      roleId,
    });
    if (region === "") {
      setupdataIsDisabled(true);
    } else {
      setupdataIsDisabled(false);
    }
    setisUpdateVisible(true);
  };
  // 用户状态改变
  const onChange = (row) => {
    row.roleState = !row.roleState;
    setDataSource([...dataSource]);
    axios.patch(`http://localhost:8000/users/${row.id}`, {
      roleState: row.roleState,
    });
  };
  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      render: (text) => <b>{text ? text : "全球"}</b>,
      filters: [
        {
          text: "全球",
          //  value: '全球',
          value: "",
        },
        ...regionList.map((item) => {
          return { text: item.title, value: item.value };
        }),
      ],
      onFilter: (value, item) => {
        // if(value === '全球'){
        //   return item.region === ''
        // }
        return item.region === value;
      },
    },
    {
      title: "角色名称",
      dataIndex: "role",
      render: (role) => role?.roleName,
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "用户状态",
      render: (row) => (
        <Switch
          checked={row.roleState}
          disabled={row.default}
          onChange={() => onChange(row)}
        />
      ),
    },
    {
      title: "操作",
      render: (row) => (
        <span>
          <Button
            danger
            shape="circle"
            disabled={row.default}
            icon={<DeleteOutlined onClick={() => confirm(row)} />}
          />
          &nbsp;&nbsp;
          <Button
            type="primary"
            shape="circle"
            disabled={row.default}
            onClick={() => edit(row)}
            icon={<MenuFoldOutlined />}
          />
        </span>
      ),
    },
  ];
  const addUsers = () => {
    setvisible(true);
  };
  const [form] = Form.useForm();
  const [updateform] = Form.useForm();
  const onCreate = (values) => {
    axios
      .post("http://localhost:8000/users", {
        ...values,
        roleState: true,
        defaule: false,
      })
      .then((res) => {
        axios.get("http://localhost:8000/users?_expand=role").then((res) => {
          //
          // if (roleId !== 1) {
          //   res.data = res.data.filter(
          //     (item) =>
          //       item.id === id ||
          //       (item.region === region && item.roleId > roleId)
          //   );
          // }
          res.data = handlerDataSource(res.data)
          setDataSource(res.data);
        });
      });
    setvisible(false);
  };
  const onUpdate = (values) => {
    axios
      .patch(`http://localhost:8000/users/${currentId}`, {
        ...values,
      })
      .then(() => {
        setisUpdateVisible(false);
        axios.get("http://localhost:8000/users?_expand=role").then((res) => {
          // 如果是超级管理员身份可以展示所有 不是就只能展示当前身份和当前地区相同的等级身份低的
          // if (roleId !== 1) {
          //   res.data = res.data.filter(
          //     (item) =>
          //       item.id === id ||
          //       (item.region === region && item.roleId > roleId)
          //   );
          // }
          res.data = handlerDataSource(res.data)
          setDataSource(res.data);
        });
      });
  };
  return (
    <div>
      <Button type="primary" onClick={addUsers} disabled={roleId===3}>
        添加用户
      </Button>
      <Modal
        visible={visible}
        title="添加用户"
        okText="添加"
        cancelText="取消"
        onCancel={() => {
          setvisible(false);
        }}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          form={form}
          roleId={roleId}
          region={region}
        />
      </Modal>
      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setupdataIsDisabled(!updataIsDisabled);
          setTimeout(() => {
            setisUpdateVisible(false);
          }, 0);
        }}
        onOk={() => {
          updateform
            .validateFields()
            .then((values) => {
              updateform.resetFields();
              onUpdate(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          form={updateform}
          updataIsDisabled={updataIsDisabled}
          currentRoleId={currentRoleId}
          roleId={roleId}
          region={currentRegion}
          isupdate={true}
        />
      </Modal>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
