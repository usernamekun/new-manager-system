import axios from "axios";
import {store} from '../redux/store'
import {changeSpining} from '../redux/action'
axios.defaults.baseURL = 'http://localhost:8000'
const requests = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 5000
})
// 请求拦截器
axios.interceptors.request.use(function (config) {
  // 在请求前可以做一些事情
  // 打开 loading加载
  store.dispatch(changeSpining(true))
  return config;
}, function (error) {
  // 当请求发生错误时
  return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use(function (response) {
  if(response.status === 200){
    // 响应成功关闭loading效果
    store.dispatch(changeSpining(false))
  }
  return response;
}, function (error) {
  store.dispatch(changeSpining(false))
  return Promise.reject(error);
});
export default requests