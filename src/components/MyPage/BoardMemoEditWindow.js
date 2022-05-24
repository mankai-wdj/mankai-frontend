import React from 'react'
import axios from 'axios'
import { useRef, useEffect } from "react";
import suneditor from "suneditor";
import plugins from "suneditor/src/plugins";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone'
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';

import {useDispatch} from 'react-redux'


function BoardMemoWindow({match}){

    const [contentText,setContentText] = React.useState("");
    const [memoId, setMemoId] = React.useState("");
    const [memoTitle, setMemoTitle] = React.useState("");
    const [notFirst, setNotFirst] = React.useState(false);

    let editor = useRef(null)
    let txtArea = useRef();

    const dispatch = useDispatch();

    useEffect(()=>{
      axios.get('/api/boardmemoedit/'+match.params.memo_id)
      .then(res=>{ 
          setContentText(res.data.content_text);
          setMemoId(res.data.id);
          setMemoTitle(res.data.memo_title);
      })
      .catch(err=>{
          console.log(err);
      })
    },[])

    const PostUpload = (e) =>{
        console.log("editor.current.getContents():",editor.current.getContents())
        axios.post('/api/boardmemoedit',{
          content_text : editor.current.getContents(),
          memo_id : memoId,
          memo_title : memoTitle
        })
        .then((res)=>{
          dispatch({
            type: 'UPDATE_MEMO',
              payload: { content_text:editor.current.getContents(), memo_title:memoTitle, memo_id:memoId },
            })
        })
        .catch((err)=>{
          console.log(err)
        })
        window.BRIDGE.editclick();
        //안드로이드의 함수를 실행하기 위함이다.
      } 

    const PostDelete = () => {
      axios.post('/api/deletememos/'+memoId)
      .then((res)=>{
        console.log(res);
        window.BRIDGE.deleteclick();
      })
      .catch((err)=>{})
        //안드로이드의 함수를 실행하기 위함이다.
    }
   
    useEffect(() => {

       console.log("useEffect실행횟수")
       if(contentText){
        editor.current = suneditor.create(txtArea.current, {
          plugins: plugins, 
          width: "100%",
          height: "100%",
          minHeight:"400px",
          maxHeight: "550px",
          buttonList: [
          //   Default
            ["undo", "redo"],
            ["font", "fontSize", "formatBlock"],
            ["paragraphStyle", "blockquote"],
            ["bold", "underline", "italic", "strike", "subscript", "superscript"],
            ["fontColor", "hiliteColor", "textStyle"],
            ["removeFormat"],
            ["outdent", "indent"],
            ["align", "horizontalRule", "list", "lineHeight"],
            ["table", "link", "image", "video", "audio"],
            ["imageGallery"],
          ],
          historyStackDelayTime: 100,
          attributesWhitelist: {
            all: "style"
          },
        })
      }
       
    },[contentText])

    useEffect(()=>{
      console.log("contentText",contentText);
    },[contentText]) 

    


    return(
        <div>{
          (contentText) ?
              <div> 
              <textarea ref={txtArea} value={contentText} /> 
              <div className="flex justify-center">
              <button className="mt-3 p-2 rounded-xl bg-blue-200" onClick={PostUpload}><EditTwoToneIcon sx={{ mb:0.8, width:50  }}/>수정하기</button>
              <button className="mt-3 ml-3 p-2 rounded-xl bg-blue-200" onClick={PostDelete}><DeleteForeverTwoToneIcon sx={{ mb:0.8, width:50  }}/>삭제하기</button>
              </div> 
              </div>
              :null 
            }
        </div>
    )
}export default BoardMemoWindow