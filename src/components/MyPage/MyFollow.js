import { Button } from '@mui/material';
import { useState } from "react";
import { BiPaperPlane } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { useSelector, useDispatch } from 'react-redux';
import { Skeleton,Avatar,Typography,Box } from '@mui/material';


export default function MyFollow() {

  const followers = useSelector(state=> state.Reducers.followers);

  const dispatch = useDispatch();


  return (
    
        
     <div>
        { (followers) ?
           followers.map((follower)=>(
          <div key={follower.id} className='border border-gray-300 rounded py-2 px-4 my-3'>
            <img  alt="" className="rounded-full border border-gray-100 w-12 h-12 inline-block" src={ 
              (follower.profile) ? (follower.profile)
              :"https://www.taggers.io/common/img/default_profile.png"} />
            
            <Button href={"/youpage/"+follower.id}>{follower.name}
            </Button>
            <BsThreeDots className='float-right my-4 mx-4'/>
            <BiPaperPlane className='float-right my-4'/>
          </div>
        )) 
            : 
            <div>
              {/* 나중에 반복문으로 처리 */}
              <> 
<Box width="100%" sx={{ display: 'flex', alignItems: 'center', mt:1}}>
<Skeleton variant="rectangular" style={{ borderRadius: 4, }} width="100%">
          <div style={{ paddingTop: '5.7%'}} />
        </Skeleton>
</Box>

<Box width="100%" sx={{ display: 'flex', alignItems: 'center', mt:2}}>
<Skeleton variant="rectangular" style={{ borderRadius: 4, }} width="100%">
          <div style={{ paddingTop: '5.5%'}} />
        </Skeleton>
</Box>

<Box width="100%" sx={{ display: 'flex', alignItems: 'center', mt:2}}>
<Skeleton variant="rectangular" style={{ borderRadius: 4, }} width="100%">
          <div style={{ paddingTop: '5.5%'}} />
        </Skeleton>
</Box>

<Box width="100%" sx={{ display: 'flex', alignItems: 'center', mt:2}}>
<Skeleton variant="rectangular" style={{ borderRadius: 4, }} width="100%">
          <div style={{ paddingTop: '5.5%'}} />
        </Skeleton>
</Box>

<Box width="100%" sx={{ display: 'flex', alignItems: 'center', mt:2}}>
<Skeleton variant="rectangular" style={{ borderRadius: 4, }} width="100%">
          <div style={{ paddingTop: '5.5%'}} />
        </Skeleton>
</Box>

<Box width="100%" sx={{ display: 'flex', alignItems: 'center', mt:2}}>
<Skeleton variant="rectangular" style={{ borderRadius: 4, }} width="100%">
          <div style={{ paddingTop: '5.5%'}} />
        </Skeleton>
</Box>

<Box width="100%" sx={{ display: 'flex', alignItems: 'center', mt:2}}>
<Skeleton variant="rectangular" style={{ borderRadius: 4, }} width="100%">
          <div style={{ paddingTop: '5.5%'}} />
        </Skeleton>
</Box>

<Box width="100%" sx={{ display: 'flex', alignItems: 'center', mt:2}}>
<Skeleton variant="rectangular" style={{ borderRadius: 4, }} width="100%">
          <div style={{ paddingTop: '5.5%'}} />
        </Skeleton>
</Box>


            </>
            </div>
        }
      </div>
       
        
  )
        };
