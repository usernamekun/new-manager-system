import React, { useEffect, useState } from 'react'
import {Input,Select, Form} from 'antd'

export default function UserForm(props) {
  const [isDisabled,setIsDisabled] = useState(false)
  const { regionList, roleList, form, updataIsDisabled, region, roleId,currentRoleId,isupdate } = props
  const addChange = (value) => {
    if(value===1){
      // 改变表单中某个表单的数据
      form.setFieldsValue({
        region: ''
      })
      setIsDisabled(true)
    }else{
      setIsDisabled(false)
    }
  }
  useEffect(()=>{
    setIsDisabled(updataIsDisabled)
  },[updataIsDisabled])
  return (
    <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              {
                required: true,
                message: "请输入用户名",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              {
                required: true,
                message: "请输入密码",
              },
            ]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item
            name="region"
            label="区域"
            rules={[{ required:!isDisabled, message: "请选择区域" }]}
          >
            <Select disabled={isDisabled}>
            {
                regionList.map(item=>{
                  return (
                    <Select.Option disabled={roleId===1||(!isupdate&&item.region===region)?false:item.value!==region} 
                    key={item.id} value={item.value}>{item.title}</Select.Option>
                  )
                })
              }
            </Select>
          </Form.Item>
          <Form.Item
            name="roleId"
            label="角色名称"
            rules={[{ required: true, message: "请选择角色" }]}
          >
            <Select onChange={addChange}>
              {
                roleList.map(item=>{
                  return (
                    <Select.Option disabled={roleId===1||(!isupdate&&item.id>roleId)?false:item.id!==currentRoleId} key={item.id} value={item.id}>{item.roleName}</Select.Option>
                  )
                })
              }
            </Select>
          </Form.Item>
        </Form>
  )
}
