import React, { useEffect, useState } from "react";
import { PageHeader, Card, Col, Row, List, Button } from "antd";
import axios from "axios";
import _ from "loadsh";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const [newsList, setNewsList] = useState([]);
  const [categoryList, setcategoryList] = useState([]);
  const push = useNavigate()
  useEffect(() => {
    axios("/news?publishState=2&_expand=category").then((res) => {
      let categoryList = Object.keys(
        _.groupBy(res.data, (item) => item.category.title)
      );
      console.log(Object.entries(_.groupBy(res.data, (item) => item.category.title)));
      setNewsList(res.data);
      setcategoryList(categoryList);
    });
  }, []);
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="全球大新闻"
        subTitle="查看新闻"
      />
      <Row gutter={[16,16]}>
        {categoryList.map((item) => (
          <Col span={8} key={item}>
            <Card
              title={item}
              style={{ height: "280px" }}
              hoverable
              bordered={true}
            >
              <List
                pagination={{ pageSize: 2 }}
                dataSource={newsList.filter(item1=>item1.category.title===item)}
                renderItem={(item) => (
                  <List.Item>
                    <Button onClick={()=>push(`/details/${item.id}`)} style={{ padding: 0 }} type="link">
                      {item.title}
                    </Button>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
