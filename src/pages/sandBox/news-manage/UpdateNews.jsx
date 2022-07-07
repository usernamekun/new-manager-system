import React, { useState, useEffect } from "react";
import axios from "axios";
import { PageHeader, Steps, Form, Select, Input, Button, message, notification } from "antd";
import  {SmileOutlined} from '@ant-design/icons'
import PubSub from "pubsub-js";
import MyEditor from "../../../components/Myedit";
import { useNavigate, useParams } from "react-router-dom";
const { Step } = Steps;
const { Option } = Select;
const layout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 22,
  },
};
export default function AddNews() {
  const [form] = Form.useForm();
  // 获取当前步骤
  const [currentStep, setcurrentStep] = useState(0);
  // 获取分类
  const [categories, setcategories] = useState([]);
  const [content, setcontent] = useState("");
  // 进度条
  const [percent, setpercent] = useState(0);
  // 表单内容
  const [formContent, setformContent] = useState({})
  // 获取当前新闻
  const [currentNews,setCurrentNews] = useState(null)
  const push = useNavigate()
  const {id} = useParams()
  useEffect(() => {
    axios.get("http://localhost:8000/categories").then((res) => {
      setcategories(res.data);
    });
  }, []);
  useEffect(() => {
    axios.get(`http://localhost:8000/news/${id}`).then((res) => {
      console.log(res.data);
      setCurrentNews(res.data)
      const {title,categoryId} = res.data
      form.setFieldsValue({
        title,
        categoryId,
      })
    });
  }, [id,form]);
  useEffect(() => {
    PubSub.subscribe("getContent", (_, value) => {
      setcontent(value);
    });
  }, []);
  // 上一步
  const backStep = () => {
    setcurrentStep((value) => --value);
    setpercent((currentStep - 1) * 50);
  };
  // 下一步
  const nextStep = () => {
    if (currentStep === 0) {
      form
        .validateFields()
        .then((res) => {
          setcurrentStep((value) => value + 1);
          setpercent((currentStep + 1) * 50);
          setformContent(res)
        })
        .catch((err) => console.log(err));
    } else {
      if (content === "" || content.trim() === "<p></p>") {
        message.error("文本内容不能为空!");
      } else {
        setcurrentStep((value) => value + 1);
        setpercent((currentStep + 1) * 50);
      }
    }
  }
  const handlerSave = (flag) => {
    axios.patch(`http://localhost:8000/news/${id}`,{
      ...formContent,
      content,
      "auditState": flag?0:1,
      "createTime": Date.now(),
    }).then(()=>{
      push(flag?'/news-manage/draft':'/audit-manage/list')
      notification.open({
        message: flag?'保存成功':'提交成功',
        description:
          `你可以在${flag?'草稿箱':'审核列表'}中查看你的文章`,
        icon: (
          <SmileOutlined
            style={{
              color: '#108ee9',
            }}
          />
        ),
      });

    })
  }
  return (
    <div>
      <PageHeader onBack={() => push(-1)} className="site-page-header" title="撰写新闻" />
      <Steps current={currentStep} percent={percent} type="navigation">
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主题内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        className={currentStep === 0 ? "" : "active"}
      >
        <Form.Item
          name="title"
          label="新闻标题"
          rules={[
            {
              required: true,
              message: "标题不能为空",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="categoryId"
          label="新闻分类"
          rules={[
            {
              required: true,
              message: "请选择分类",
            },
          ]}
        >
          <Select
            placeholder="请选择新闻类别"
            allowClear
          >
            {categories.map((item) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.title}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
      <MyEditor content={currentNews&&currentNews.content} active={currentStep === 1 ? "" : "active"} />
      <div
        style={{
          padding: "20px 80px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          style={{ display: currentStep >= 1 ? "block" : "none" }}
          // type="primary"
          onClick={backStep}
        >
          上一步
        </Button>
        <Button
          style={{ display: currentStep !== 2 ? "block" : "none" }}
          type="primary"
          onClick={nextStep}
        >
          下一步
        </Button>
        <Button
          style={{
            display: currentStep === 2 ? "block" : "none",
            // marginTop: "50px",
          }}
          type="primary"
          onClick={()=>handlerSave(0)}
        >
          提交审核
        </Button>
        <Button
          style={{ display: currentStep === 2 ? "block" : "none" }}
          danger
          onClick={()=>handlerSave(1)}
        >
          保存草稿
        </Button>
      </div>
    </div>
  );
}
