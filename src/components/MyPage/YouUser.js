import * as React from 'react';
import { useSelector,useDispatch } from 'react-redux'
import Typography from '@mui/material/Typography';
import {Avatar} from '@mui/material'
import { Link } from 'react-router-dom';
import avatar from '../../images/sosoeueunOctocat.png'
import '../../styles/MyPage.css'
import axios from 'axios';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {Skeleton} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check';
import {BiPaperPlane} from "react-icons/bi";

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function YouUser() {

  const dispatch = useDispatch();

  const follow = useSelector(state => state.Reducers.followId);
  const followerFollower = useSelector(state=>state.Reducers.followerFollower);
  const user = useSelector(state => state.Reducers.user)
  const [notFollow,setNotFollow] = React.useState(true);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const yesFollow = () => {
    setNotFollow(false)
  }

  const noFollow = () => {
    setNotFollow(true)
  }

  const makeFollow = () => {
    axios.post('/api/user/follow',{
      to_user_id : user.id,
      user_id : follow.id,
    })
    .then((res)=>{
      console.log(res)
      // dispatch를 보내서 reducers의 follow에 추가시켜야한다. 
      dispatch({
        type:"TOGGLE_FOLLOWERFOLLOWER",
        payload: {followerFollower:user}
      })
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  React.useEffect(()=>{
    if(!followerFollower === false){
      for (let i = 0 ;i< followerFollower.length; i++){
        if(followerFollower[i].id === user.id){
          yesFollow();
        }
      }
  }
  },[followerFollower])

  return (
    <div id='user_page' className='bg-white border-solid rounded-lg p-3 drop-shadow-xl'>
      {
      (follow)?
      (follow.profile) ?
      <Avatar src={follow.profile} sx={{ borderColor:'black', border:2, m:'auto', width:'200px',height:'200px' }} alt="Avatar"/>
    :
    <Avatar sx={{ borderColor:'black', border:2, m:'auto', width:'200px',height:'200px',fontSize:'90px' }} alt="Avatar">
      {(follow.name).charAt(0)}
    </Avatar>
    : <Avatar src="https://www.taggers.io/common/img/default_profile.png" sx={{ m:'auto', minWidth:'50%',height:'auto' }} alt="Avatar">
    </Avatar>
    }
    {/* 다 줄였을 때 사진이 튀어나옴. MyUser와 다르게 */}
  
      
      <div className="text-2xl mt-5 grid justify-items-center font-black">
        {(follow.name) ? follow.name : <Skeleton variant="rectangular" style={{ borderRadius: 4, }} width={50} height={20} />}
        </div>
        <br/>
        <Typography variant="body2" color="text.secondary" sx={{ textOverflow: 'ellipsis',mt:3 }}>
          {follow.description}
        </Typography>

        <br/>
        {
          (notFollow) ?
        <div className="grid justify-items-end">
          <button onClick={()=>{yesFollow(); makeFollow();}} className='flex items-center bg-purple-600  hover:bg-purple-800 text-white py-2 px-4 rounded '>
             <PersonAddIcon sx={{ mr:1 }}/> 팔로우
          </button>
        </div>
        : 
        <div>
      <div class="space-x-4">
  <div class="inline-block">
  <button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className='flex items-center bg-gray-300  hover:bg-gray-400 text-white py-2 px-4 rounded '
      >
        <CheckIcon sx={{ mr : 1 }}/>팔로잉
      </button>
  </div>
  <div class="inline-block">
  <button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        className='flex items-center bg-purple-600  hover:bg-purple-400 text-white py-2 px-4 mb-3 rounded'
      >
       <BiPaperPlane sx={{ mr : 1 }}/> 메시지
      </button>
  </div>
</div>
      {/* 두개를 나란히 오른쪽으로 놔야됨 */}
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        

        <MenuItem onClick={()=>{handleClose(); noFollow(); makeFollow()}}>팔로우취소</MenuItem>
      </Menu>
    </div>
      }
      
    </div>
  );
}
