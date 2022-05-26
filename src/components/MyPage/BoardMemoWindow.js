import React from 'react'
import axios from 'axios'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import SunEditor from 'suneditor-react'
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone'
import Typography from '@mui/material/Typography'
import {IoIosCloseCircle} from 'react-icons/io'

function BoardMemoWindow({match}){

    const [contentText,setContentText] = React.useState(null);
   
    React.useEffect(()=>{
        axios.get('/api/boardmemo/'+match.params.memo_id)
            .then(res=>{
                setContentText(res.data.content_text);
                console.log(res.data.content_text);
            })
            .catch(err=>{
                console.log(err);
            }
            ,[])})

    return(
        <div>
            {
                (contentText) ?
                <SunEditor 
           readOnly
           hideToolbar
           disable
           height="500" 
           defaultValue={contentText}/>
           :
           null
            }
        </div>
        
    )
}export default BoardMemoWindow