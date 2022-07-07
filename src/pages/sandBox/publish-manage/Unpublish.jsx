import React from "react";
import {Button} from 'antd'
import MyPublish from "../../../components/publish-manage/MyPublish";
import UsePublish from "../../../components/publish-manage/usePublish"
export default function Unpublisht() {
  const {dataSource,handlerButton} = UsePublish(1)
  return (
    <MyPublish  
      isDanger={0}
      dataSource={dataSource}
      button={(id)=><Button onClick={() => handlerButton(id,2)} type='primary'>发布</Button>}
      />
  );
}
