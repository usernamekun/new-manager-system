import React, { useEffect, useState } from "react";
import { PageHeader, Descriptions } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment";
const auditState = {
  0: "未审核",
  1: "审核中",
  2: "已通过",
  3: "未通过",
};
const publishState = {
  0: "未发布",
  1: "待发布",
  2: "已上线",
  3: "已下线",
};
const colorState = {
  0: "#767c6b",
  1: "#d9a62e",
  2: "green",
  3: "red",
};
export default function PreviewNews() {
  const [dataSource, setDataSource] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`http://localhost:8000/news?id=${id}&_expand=category&_expand=role`)
      .then((res) => {
        setDataSource(res.data[0]);
      });
  }, [id]);

  return (
    <div>
      {
        // 经典错误问题  一开始dataSource是没有空的直接赋值会报错的所以要等dataSource有数据了才开始渲染才不会报错

        dataSource && (
          <div>
            <PageHeader
              ghost={false}
              onBack={() => window.history.back()}
              title={dataSource.title}
              subTitle={dataSource.category.title}
            >
              <Descriptions size="small" column={3}>
                <Descriptions.Item label="创建者">
                  {dataSource.author}
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">
                  {moment(dataSource.createTime).format("YYYY/MM/DD HH:mm:ss")}
                </Descriptions.Item>
                <Descriptions.Item label="发布时间">
                  {dataSource.publishTime
                    ? moment(dataSource.publishTime).format(
                        "YYYY/MM/DD HH:mm:ss"
                      )
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="区域">
                  {dataSource.region}
                </Descriptions.Item>
                <Descriptions.Item label="审核状态">
                  <span style={{fontWeight:'bold', color: colorState[dataSource.auditState] }}>
                    {auditState[dataSource.auditState]}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="发布状态">
                  <span style={{fontWeight:'bold', color: colorState[dataSource.publishState] }}>
                    {publishState[dataSource.publishState]}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="访问数量">
                  {dataSource.view}
                </Descriptions.Item>
                <Descriptions.Item label="点赞数量">
                  {dataSource.star}
                </Descriptions.Item>
                <Descriptions.Item label="评论数量">0</Descriptions.Item>
              </Descriptions>
            </PageHeader>
            {/* 让div可以解析html标签 */}
            <div
              dangerouslySetInnerHTML={{ __html: dataSource.content }}
              style={{
                margin: "0 24px",
                border: "1px solid #efefef",
                paddingTop: '10px',
                fontSize: '13px',
                minHeight: '100px'
              }}
            ></div>
          </div>
        )
      }
    </div>
  );
}
