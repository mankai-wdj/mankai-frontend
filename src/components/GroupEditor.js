import { useRef, useEffect, useState } from "react";
import suneditor from "suneditor";
import SunEditor from 'suneditor-react';
import plugins from "suneditor/src/plugins";
import "suneditor/dist/css/suneditor.min.css";
import axios from "axios";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

function GroupEditor ({group_intro,content,getContent}){

    let editor = useRef(null)
    let txtArea = useRef();

    const PostUpload = (e) =>{
        console.log("editor.current.getContents():",editor.current.getContents())
        getContent(editor.current.getContents())
    } 
    const imageHandle = (e) =>{
      console.log(e)
    }
    useEffect(() => {
        editor.current = suneditor.create(txtArea.current, {
          plugins: plugins, 
          width: "100%",
          height: "100%",
          minHeight:"400px",
          maxHeight: "400px",
          youtubeQuery: "&autoplay=1",
          buttonList: [
          // Default
            ["undo", "redo"],
            ["font", "fontSize", "formatBlock"],
            ["paragraphStyle", "blockquote"],
            ["bold", "underline", "italic", "strike", "subscript", "superscript"],
            ["fontColor", "hiliteColor", "textStyle"],
            ["removeFormat"],
            ["outdent", "indent"],
            ["align", "horizontalRule", "list", "lineHeight"],
            ["table", "link", "image", "video", "audio"],
          ],
          historyStackDelayTime: 100,
          attributesWhitelist: {
            all: "style"
          },
        })
      }, [])

    return(
        <div>
            <textarea ref={txtArea} defaultValue={group_intro}/>
            <div className="mt-2">
            <Button variant="contained"  endIcon={<SendIcon/>} onClick={PostUpload}>
            Commit!
            </Button>
            </div>

        </div>
    )
}export default GroupEditor