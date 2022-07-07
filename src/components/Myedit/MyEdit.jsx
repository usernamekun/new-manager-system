import React, {useEffect, useState} from "react";
import PubSub from "pubsub-js";
import { convertToRaw,ContentState,EditorState } from "draft-js";
import draftTohtml from 'draftjs-to-html'
import htmlToDraft from "html-to-draftjs";
// import "draft-js/dist/Draft.css";
import { Editor } from "react-draft-wysiwyg";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
export default function MyEditor(props) {
  const [editorState, setEditorState] = useState('');
  // let [content,setContent] = useState('')
  const editor = React.useRef(null);
  const blur = () => {
    // 获取到当前富文本框的内容并且转换为html标签内容
    PubSub.publish('getContent',draftTohtml(convertToRaw(editorState.getCurrentContent())))
  }
  useEffect(()=>{
    console.log(111);
    // 将html文档转换为draft
    let contentBlock = htmlToDraft(props.content)
    console.log(contentBlock);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState)
      console.log(editorState);
    }
  },[props.content])
  return (
    <div className={props.active}
      style={{ minHeight: "6em", cursor: "text" }}
    >
      <Editor
        ref={editor}  
        editorState={editorState}
        onEditorStateChange={(value)=>setEditorState(value)}
        placeholder="请输入新闻内容!"
        onBlur={blur}
      />
    </div>
  );
}
