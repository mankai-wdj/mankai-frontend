import React, { Component, useEffect, useRef, useState } from 'react';
import { Avatar, Button, Card, IconButton, Modal, TextField } from '@mui/material';
import BoardSide from './BoardSide';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ShareIcon from '@mui/icons-material/Share';
import SvgIcon from '@mui/material/SvgIcon';
import ChatIcon from '@mui/icons-material/Chat';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { red } from '@mui/material/colors';
import { useDispatch, useSelector } from 'react-redux';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import BoardImages from './BoardImages';
import Moment from 'react-moment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import settings2 from 'react-useanimations/lib/settings2'
import UseAnimations from 'react-useanimations';
import heart from 'react-useanimations/lib/heart'
import { Box } from '@mui/system';

function GroupBoardSideCard(props){
    
    const dispatch = useDispatch();
    const user = useSelector(state=>state.Reducers.user)
    const imageList = useSelector(state=>state.Reducers.sideImageList)
    const likeUpdate = useSelector(state=>state.Reducers.likeUpdate)
    const likeId = useSelector(state=>state.Reducers.likeId)
    const isOpen = useSelector(state=>state.Reducers.isOpen)
    const sideData = useSelector(state=>state.Reducers.sideData)
    const [isLike,setIsLike] = useState(false)
    const [likes,setLikes] = useState([])
    const option = ["번역하기","클립보드로 이동"]
    const [translated,setTranslated] = useState("");
    const animationHandle = useRef(null)
    const [titleFieldValue,setTitleFieldValue] = useState("")
    const [modalOpen,setModalOpen]=useState(false)

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
    const ClickLike = () => {
        dispatch({
            type:"LIKE_UPDATE",
            payload:{
                board_id:props.board.id
            }
        })
        setIsLike(true)
        axios.post('/api/post/grouplike',{
            user_id:user.id,
            board_id:props.board.id
        }).then(res=>{
            console.log(res.data)
            setLikes(res.data)
        })
    }
    const ModalOpen = () =>{
        setModalOpen(true)
    }
    const ModalClose = () =>{
        setModalOpen(false)
    }
    const submitMemo = (titlefieldvalue) => {
        axios.post("/api/storememo",{
            content_text:{sideData}.sideData.content_text,
            memo_title : titlefieldvalue,
            user_id : user.id,
            post_memo_id : {sideData}.sideData.id
        })
        // post_memo_id를 보낸게 MemoController에서 게시글에 딸린 이미지를 저장할 수 있게 해준다. 
        .then((res)=>{
            console.log(res);
            ModalClose();
            dispatch({
                type: 'ADD_MEMO',
                payload: { memo: res.data },
              })
        })
        .catch((err)=>{
            console.log(err);
        })
        setTitleFieldValue("")
    }
    
    const textChange = (e) =>{
        setTitleFieldValue(e.target.value)
    }
    const ClickDisLike =() => {
        dispatch({
            type:"LIKE_UPDATE",
            payload:{
                board_id:props.board.id
            }
        })
        setIsLike(false)
        axios.post('/api/delete/grouplike',{
            user_id:user.id,
            board_id:props.board.id
        }).then(res=>{
            console.log(res.data)
            setLikes(res.data)
        })
    }
    // 메뉴바 
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        console.log("클릭")
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (e) => {
        let eText = e.target.outerText;
        if(eText == option[0])
        {
            // console.log(props.board.content_text)
            axios.post('/api/show/papago',{
                text:props.board.content_text
            }).then(res=>{
                // console.log(res.data)
               setTranslated(res.data.message.result.translatedText); 
            })
        }
        else if (eText == option[1])
        {
            ModalOpen()
        }
        setAnchorEl(null);
    };

    useEffect(()=>{
        if(isOpen && likeId == props.board.id){
            axios.get('/api/show/grouplike/'+props.board.id)
            .then(res=>{
                console.log("likeupdate 받기",res.data)
                setLikes(res.data)
            })
        }
    },[likeUpdate])

    useEffect(()=>{
        axios.get('/api/show/grouplike/'+props.board.id)
            .then(res=>{
                console.log("showLike",res.data)
                setLikes(res.data)
            })
    },[sideData])

    // 좋아요 업데이트되면 유저 있는지 체크
    useEffect(()=>{
        setIsLike(false)
        likes.forEach(like=>{
            // console.log("좋아요체크",like,isLike)
            if(user.id == like.user_id)
            {
                setIsLike(true)
            }
        })
    },[likes])

    return (  
        <div className ="w-full mx-auto max-w-3xl px-1 mb-3">
            <div>
                <div className="bg-white w-full rounded-md shadow-md mt-2">
                    <div className="w-full h-16 ml-2 flex items-center flex justify-between ">
                        <div className='w-full flex justify-between mt-10 py-1 px-4 mr-4 rounded-lg  border-2 border-gray-300'> 
                            <div className="flex mt-1">
                                {
                                     (props.board.profile) 
                                     ?<Avatar src={props.board.profile} alt=""/>
                                     : (props.board.name) && 
                                     <Avatar>{props.board.name.charAt(0)}</Avatar>    
                                }
                                <div className='ml-3'>
                                    <h3 className="font-bold text-md">{props.board.name}</h3>
                                    <p className='text-sm text-gray-500'><Moment format='YYYY/MM/DD'>{props.board.created_at}</Moment></p>
                                </div>
                            </div>
                            <div className='z-10'>
                            <UseAnimations  onClick={handleClick} size={36} animation={settings2}/>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    {option.map((option)=>{
                                        return(
                                            <MenuItem key={option} onClick={handleClose}>{option}</MenuItem>
                                        )
                                    })}
                                    
                                </Menu>
                            </div>
                        </div>
                    </div>
                    <div className='w-full mt-10 '>
                        <div className='w-full mx-auto px-5'>
                            {/* 게시글 사진및 본문내용 */}
                            <p className='font-bold'>{props.board.content_text}</p>
                            <p className="bg-gray-200">{translated}</p>
                            
                            {imageList != "No Data"
                                ?<div className='mt-3'><BoardImages imageList={imageList}/></div>
                                :<p></p>
                            }
                        </div>
                        <div className='mx-auto px-10 mt-10' >    
                            <div className='pb-4'>
                                <div className='flex'>
                                    <div className='w-1/3 grid grid-cols-2'> 
                                        {isLike
                                          ?
                                            <div className='flex ml-10 my-auto'>
                                                <UseAnimations onClick={ClickDisLike} size={48} fillColor="red" reverse animation={heart}/> 
                                                <p className='my-auto'>{likes ? likes.length : 0}</p>
                                            </div>

                                            :<div className='flex ml-10 my-auto'>
                                                <UseAnimations ref={animationHandle} onClick={ClickLike} size={48} fillColor="red" animation={heart}/> 
                                                <p className='my-auto'>{likes ? likes.length : 0}</p>
                                            </div>

                                        }       
                                    </div>
                                    
                                    <div className='w-2/3 text-right'>
                                        <Button>
                                                <SvgIcon color='action' className='mx-auto' component={ShareIcon} fontSize="large"/>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                open={modalOpen}
                onClose={ModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                <TextField 
                fullWidth 
                value={titleFieldValue}
                onChange={textChange}
                multiline 
                maxRows={5}
                id="standard-basic" 
                label="메모 제목을 적어주세요" 
                variant="standard"
                />

                <Button onClick={() => {submitMemo(titleFieldValue)}} sx={{ ":hover":{
                    backgroundColor:'#6f53f0'
                }, backgroundColor:'#4D2BF4', }} variant="contained" className="submit_button">메모저장</Button>
                </Box>
            </Modal>
        </div>
    );   
}
export default GroupBoardSideCard;