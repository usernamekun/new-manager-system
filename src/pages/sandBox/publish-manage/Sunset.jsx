import React from "react";
import MyPublish from "../../../components/publish-manage/MyPublish";
import UsePublish from "../../../components/publish-manage/usePublish"
export default function Unpublisht() {
  const {dataSource,handlerButton} = UsePublish(3)
  return (
    <MyPublish
      ButtonText="删除"
      ButtonType='primary'
      isDanger={0}
      dataSource={dataSource}
      handlerButton={handlerButton}
    />
  );
}
