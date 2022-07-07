import React, { useEffect, useState } from "react"
import { useRoutes } from 'react-router-dom'
import axios from "axios"
// import routers from "./routers"
import './App.css'
import Home from "./pages/sandBox/Home"
import Login from "./pages/Login"
import NewsSandBox from "./pages/sandBox/NewsSandBox"
import UserList from "./pages/sandBox/user-manger/UserList"
import RoleList from './pages/sandBox/right-mange/RoleList'
import RightList from "./pages/sandBox/right-mange/RightList"
import AddNews from "./pages/sandBox/news-manage/AddNews"
import CategoryNews from "./pages/sandBox/news-manage/CategoryNews"
import DraftNews from "./pages/sandBox/news-manage/DraftNews"
import Audit from "./pages/sandBox/audit-manage/Audit"
import AuditList from "./pages/sandBox/audit-manage/AuditLiist"
import Publish from "./pages/sandBox/publish-manage/Publish"
import Unpublish from "./pages/sandBox/publish-manage/Unpublish"
import Sunset from "./pages/sandBox/publish-manage/Sunset"
import PreviewNews from './pages/sandBox/news-manage/PreviewNews'
import UpdateNews from "./pages/sandBox/news-manage/UpdateNews"
import NotFound from "./pages/NotFound"
import NewsHome from "./pages/News/News"
import Detail from "./pages/News/Detail"
import { Navigate } from "react-router-dom"
import { Provider } from 'react-redux';
import {store,persistor} from './redux/store'
import './utils/requests'
import { PersistGate } from 'redux-persist/integration/react'
// 这里的路由不应该是写死的，还是动态获取的，为了防止没有权限的账号可以访问不该访问的账号
let localRouters = {
  '/home': <Home />,
  '/user-manage/list': <UserList />,
  "/right-manage/role/list": <RoleList />,
  "/right-manage/right/list": <RightList />,
  "/news-manage/add": <AddNews />,
  "/news-manage/draft": <DraftNews />,
  "/news-manage/category": <CategoryNews />,
  "/news-manage/preview/:id": <PreviewNews />,
  "/news-manage/update/:id": <UpdateNews />,
  "/audit-manage/audit": <Audit />,
  "/audit-manage/list": <AuditList />,
  "/publish-manage/unpublished": <Unpublish />,
  "/publish-manage/published": <Publish />,
  "/publish-manage/sunset": <Sunset />,
}
export default function App() {
  // 获取请求到的所有路由路径
  const [backRoute, setbackRoute] = useState([])
  let { role: { rights } } = localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):{role:{}}
  // 当前用户登录权限列表
  const checkUserPermission = (item) => {
    return rights&&rights.includes(item.key)
  }
  const routers = [
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/news',
      element: <NewsHome/>
    },
    {
      path: '/details/:id',
      element: <Detail/>
    },
    {
      path: '/',
      element: localStorage.getItem('token') ? <NewsSandBox /> : <Navigate to='/login'/>,
      children: [...(backRoute.map(item => {
        // 状态为1和当前用户登录权限列表才能挂载路由 
        if (item.pagepermisson === 1 && checkUserPermission(item)) {
          return {
            path: item.key,
            element: localRouters[item.key],
            children: item.children.map(i => {
              if ((i.pagepermisson || i.routepermisson) === 1 && localRouters[i.key] && checkUserPermission(i)) {
                return {
                  path: i.key,
                  element: localRouters[i.key]
                }
              } else {
                return {}
              }
            })
          }
        }
        return {}
      })),
      {
        path: '/',
        element: <Navigate to='/home' />
      },
      backRoute && {
        path: '*',
        element: <NotFound />
      }
      ]
    },
  ]
  const element = useRoutes(routers)
  useEffect(() => {
    axios.get('http://localhost:8000/rights?_embed=children').then(res => {
      setbackRoute(res.data)
    })
  }, [])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div>
          {element}
        </div> 
        </PersistGate>
    </Provider>
  )
}
