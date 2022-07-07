import React, { useEffect, useState } from "react";
import { PageHeader, Descriptions } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment";
const colorStyle = {
  color: "#e597b2",
  cursor: "pointer",
};
export default function PreviewNews() {
  const [dataSource, setDataSource] = useState(null);
  const { id } = useParams();
  const [isLike, setIsLike] = useState(false);
  useEffect(() => {
    axios
      .get(`http://localhost:8000/news?id=${id}&_expand=category&_expand=role`)
      .then((res) => {
        setDataSource({ ...res.data[0], view: ++res.data[0].view });
        return res.data[0];
      })
      .then((res) => {
        axios.patch(`/news/${id}`, {
          view: res.view,
        });
      });
  }, [id]);
  const like = () => {
    if (!isLike) {
      axios
        .patch(`/news/${id}`, {
          star: dataSource.star + 1,
        })
        .then((res) => {
          setDataSource({ ...dataSource, star: dataSource.star + 1 });
          setIsLike(true)
        });
    }
  };
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
              tags={
                <HeartOutlined
                  title="给我点赞吧"
                  onClick={like}
                  style={colorStyle}
                />
              }
            >
              <Descriptions size="small" column={3}>
                <Descriptions.Item label="作者">
                  {dataSource.author}
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
                <Descriptions.Item label="访问数量">
                  <span style={{ color: "green" }}>{dataSource.view}</span>
                </Descriptions.Item>
                <Descriptions.Item label="点赞数量">
                  <span style={{ color: "green" }}>{dataSource.star}</span>
                </Descriptions.Item>
                <Descriptions.Item label="评论数量">
                  <span style={{ color: "green" }}>0</span>
                </Descriptions.Item>
              </Descriptions>
            </PageHeader>
            {/* 让div可以解析html标签 */}
            <div
              dangerouslySetInnerHTML={{ __html: dataSource.content }}
              style={{
                margin: "0 24px",
                border: "1px solid #efefef",
                paddingTop: "10px",
                fontSize: "13px",
                minHeight: "100px",
              }}
            ></div>
          </div>
        )
      }
    </div>
  );
}
