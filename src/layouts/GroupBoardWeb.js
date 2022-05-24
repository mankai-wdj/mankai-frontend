import axios from "axios"
import SunEditor from "suneditor-react"
import { useEffect, useState } from "react";

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
    useEffect(()=>{
        GroupStart()
    },[match.params.board_id])
    
    return(
        <div className="w-full">
            <p className="px-5 py-2 w-full bg-gray-100 font-bold">
                {groupIntro.title}
            </p>
            {groupIntro &&     
                <SunEditor 
                    defaultValue={groupIntro.content}
                    readOnly 
                    hideToolbar
                    height="100%"
                >
                </SunEditor>
            }
        </div>
    )
}export default GroupBoardWeb