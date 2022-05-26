import axios from "axios"
import SunEditor from "suneditor-react"
import { useEffect, useState } from "react";
import GroupIntro from "./GroupIntro";

// +match.params.board_id

function GroupBoardWeb({match}){
    const [groupIntro,setGroupIntro] = useState("");
    const GroupStart = () =>{
        axios.get("/api/show/groupnoticeweb/"+match.params.board_id)
        .then(res=>{
            setGroupIntro(res.data[0]);
        })
        .catch()
    }
    const ClickTranslate = (str) =>{
        console.log(str)
        var Array = str.split
        axios.get("https://api.mankai.shop/api/show/noticeTranlate/"+match.params.board_id)
        .then(res=>{
            console.log(res)
        })
    }
    useEffect(()=>{
        GroupStart()
    },[match.params.board_id])
    
    return(
        <div className="w-full">
            <p className="px-5 py-2 w-full bg-gray-100 font-bold">
                {groupIntro.title}
            </p>
            <p className="px-5 py-2 w-full bg-gray-100 font-bold">
                {groupIntro.updated_at}
            </p>
           {groupIntro &&     
                <SunEditor 
                    defaultValue={groupIntro.content}
                    readOnly
                    disable 
                    hideToolbar
                    height="100%"
                >
                </SunEditor>
            }
        </div>
    )
}export default GroupBoardWeb