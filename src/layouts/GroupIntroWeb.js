import axios from "axios"
import SunEditor from "suneditor-react"
import { useEffect, useState } from "react";


function GroupIntroWeb({match}){
    const [groupIntro,setGroupIntro] = useState("");
    const GroupStart = () =>{
        axios.get("/api/show/detail_group/"+match.params.group_id)
        .then(res=>{
            setGroupIntro(res.data.group);
        })
        .catch()
    }
    useEffect(()=>{
        GroupStart()
    },[match.params.group_id])
    
    return(
        <div className="w-full">
            {groupIntro &&     
                <SunEditor 
                    defaultValue={groupIntro.intro}
                    readOnly 
                    disable
                    hideToolbar
                    height="100%"
                >
                </SunEditor>
            }
           
        </div>
    )
}export default GroupIntroWeb