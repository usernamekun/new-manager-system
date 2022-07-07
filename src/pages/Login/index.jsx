import React from 'react'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import ParticlesBg from 'particles-bg'
import './index.css'
import { nanoid } from 'nanoid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Login() {
  const push = useNavigate()
  const onFinish = (values) => {
    const {username,password} = values
    // 当密码和账号正确  而且登录账号的roleState属性必须为true才允许登录
    axios.get(`http://localhost:8000/users?username=${username}&password=${password}&roleState=true&_expand=role`).then(res=>{
      if(res.data.length === 0){
        message.error('账号不存在或者密码错误!')
      }else{
        localStorage.setItem('token',JSON.stringify(nanoid()))
        // 将用户信息存储下来
        localStorage.setItem('userInfo',JSON.stringify(res.data[0]))
        push('/')
      }
    })
  }
  return (
    <div className='mainner'>
      <ParticlesBg type='random' bg={true}/>
      <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <Form.Item>
        <h1 style={{textAlign:'center',color: '#efefef'}}>全球新闻后台管理系统</h1>
      </Form.Item>
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: '请输入用户名',
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入用户名  " />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: '请输入密码！',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="请输入密码"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          登录
        </Button>
      </Form.Item>
    </Form>
    </div>
  )
}
