import { Divider, Modal } from "@mui/material"
import { Box } from "@mui/system"
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import axios from "axios"
import { useEffect, useReducer, useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import SunEditor from "suneditor-react"
import GroupEditor from "../components/GroupEditor"
import CreateIcon from '@mui/icons-material/Create';


function GroupNotice(props){
    const user = useSelector(state => state.Reducers.user)
    let seditor = useRef(null)
    const [open,setOpen] = useState(false)
    const [postTitle,setPostTitle] = useState("")
    const [content,setContent] = useState("")
    const [notice,setNotice] = useState([])
    const [detailOpen,setDetailOpen] = useState(false)
    const [selectedValue,setSelectedValue] = useState([])
    const [titleOpen, setTitleOpen] = useState(false)
    const [memoTitle, setMemoTitle] = useState("")

    const dispatch = useDispatch();

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        maxHeight: 630,
        borderRadius:'10px',
        bgcolor: 'white',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

      

    const modalClose = () => {
        setOpen(false)
    }
    const modalOpen = () =>{
        setOpen(true)
    }
    const titleHandle = (e) =>{
        setPostTitle(e.target.value)
    }
    const getContent = (data)=>{
        axios.post('api/post/groupnotice',{
            title:postTitle,
            content:data,
            group_id:props.group.id,
            category_id:props.category_id,
            user_id:user.id
        }).then(res=>{
            BoardUpdate()
            modalClose()
        })
    }
    const BoardUpdate = () => {
        axios.post('api/show/groupnotice',{
            category_id:props.category_id,
            group_id:props.group.id
        }).then(res=>{
            setNotice(res.data)
        })
    }
    const detailModalClose = () =>{
        setDetailOpen(false)
    }

    useEffect(()=>{
        BoardUpdate()
    },[props.category_id])

    const ClickBoard = (data) =>{
        setSelectedValue(data)
        setDetailOpen(true) 
        console.log(seditor.current)  
    }

    const toServer = () => {
        axios.post('/api/storememo',{
            content_text : selectedValue.content,
            memo_title : memoTitle,
            user_id : user.id,
            memo_type : 'BOARD'
        })
        .then((res)=>{
            console.log(res)
            titleClose();
            dispatch({
                type: 'ADD_MEMO',
                payload: { memo: res.data },
              })
            setMemoTitle("")
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    const openMemoTitle = () => {
        setTitleOpen(true)
    }

    const titleClose = () => {
        setTitleOpen(false)
    }

    const titleChange = (e) => {
        setMemoTitle(e.target.value)
    }


    return(
        <div className="p-4">
            <div className="flex relative mb-14">
                <button className="absolute right-0 top-0 bg-gray-200 p-2 rounded-xl hover:bg-gray-300 " onClick={modalOpen}><CreateIcon></CreateIcon>글 작성하기</button>

            </div>
            <div>
                <div className="bg-indigo-200 py-2 flex rounded-t-xl text-black-200">
                    <div className="w-1/12 text-center">
                        ID
                    </div>
                    <div className="w-6/12">
                        제목
                    </div>
                    <div className="w-5/12 text-right pr-14">
                        작성일자
                    </div>
                </div>
            </div>
            {notice && notice.map((data) => {
                return(
                    <div>
                        <div onClick={()=>ClickBoard(data)} className="w-full py-3 flex hover:bg-gray-100" key={data.id}>
                            <div className="w-1/12 text-center">{data.id}</div>
                            <div className="w-6/12">{data.title}</div>
                            <div className="w-5/12 text-right pr-4">{data.updated_at}</div>    
                        </div>
                        <Divider light/>
                    </div>
                )
            })}

            {/* Show Modal */}
            <Modal 
                open={detailOpen}
                onClose={detailModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ overflow:"scroll" }}
            >
                <Box className="bg-white w-192 mx-auto mt-5 h-min rounded-xl p-5 relative">
                        <div className="">
                            <div className="flex justify-between mb-2">
                                <div className="px-2 text-xl font-bold mt-2">제목</div>
                                <div className="bg-green-200 rounded-xl p-2 hover:bg-green-300" onClick={openMemoTitle}>클립보드 보내기</div>    
                            </div>
                            <p className="w-full bg-gray-200 rounded-2xl px-4 py-2 mb-2">{selectedValue.title}</p>
                            
                            <SunEditor 
                                readOnly="true"
                                hideToolbar 
                                height="500" 
                                defaultValue={selectedValue.content}
                                />    
                                {/* <div className="h-192" dangerouslySetInnerHTML={{__html:selectedValue.content}}></div> */}
                       </div>
                 </Box>
            </Modal>


            {/* Write Modal */}
            <Modal 
                open={open}
                onClose={modalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ overflow:"scroll" }}
            >
                <Box className="bg-white w-192 mx-auto mt-5 h-min rounded-xl p-3 relative">
                    <input type={"text"} placeholder="제목을 입력해주세요!" className="bg-gray-200 w-full rounded-xl my-3 mb-2 px-4 py-2" onChange={titleHandle}></input>
                    <GroupEditor content={content} getContent={getContent}></GroupEditor>
                 </Box>
            </Modal>

            <Modal 
                open={titleOpen}
                onClose={titleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box 
                sx={style}
                >
                <TextField 
                fullWidth 
                value={memoTitle}
                onChange={titleChange}
                multiline 
                maxRows={5}
                id="standard-basic" 
                label="메모 제목을 적어주세요" 
                variant="standard"
                />

                <Button onClick={toServer} sx={{ ":hover":{
                    backgroundColor:'#6f53f0'
                }, backgroundColor:'#4D2BF4', }} variant="contained" className="submit_button">메모저장</Button>
                </Box>

        </Modal>
        </div>
    )
}export default GroupNotice