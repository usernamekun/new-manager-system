import React from "react";
import MyPublish from "../../../components/publish-manage/MyPublish";
import UsePublish from "../../../components/publish-manage/usePublish"
export default function DraftNews() {
  const {dataSource,handlerButton} = UsePublish(2)

  return (
    <MyPublish
      ButtonText="下线"
      ButtonType='primary'
      isDanger={1}
      handlerState={3}
      dataSource={dataSource}
      handlerButton={handlerButton}
    />
  );
}
