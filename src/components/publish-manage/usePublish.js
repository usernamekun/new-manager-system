import { useEffect, useState } from "react";
import { message } from 'antd'
import axios from "axios";
// 自定义Hooks
export default function usePublish(publishState) {
  const [dataSource, setdataSource] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("userInfo"));
  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/news?publishState=${publishState}&author=${username}&_expand=category`
      )
      .then((res) => {
        setdataSource(res.data);
      });
  }, [username, publishState]);
  const handlerButton = (id, handlerState) => {
    // publishState 1 待发布 2已发布 3已下线
    (handlerState? axios.patch(`http://localhost:8000/news/${id}`, handlerState !== 2 ? {
      publishState: handlerState,
    } : {
      publishState: handlerState,
      publishTime: Date.now()
    }) : axios.delete(`http://localhost:8000/news/${id}`))
      .then(() => {
        message.success('操作成功')
        setdataSource(dataSource.filter(item => item.id !== id))
      });
  }
  return { dataSource, handlerButton }
}