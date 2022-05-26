import Mic from '@mui/icons-material/Mic'
import MicOff from '@mui/icons-material/MicOff'
import Videocam from '@mui/icons-material/Videocam'
import VideocamOff from '@mui/icons-material/VideocamOff'

import { IconButton } from '@mui/material'
import { useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
function MiniPeople(props) {
  const dispatch = useDispatch()
  const user = useSelector(state => state.Reducers.user)

  return (
    <>
      <div className="flex w-full bg-tabbg">
        <span className="px-2 py-1 text-sm font-bold text-blue-900   rounded-md ">
          {props.roomName} 대화상대 {props.subscribers.length + 1}명
        </span>
        <button className="ml-auto p-1 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
          방 공유
        </button>
        <button
          className="ml-auto p-1 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          onClick={() => props.open()}
        >
          설정
        </button>
      </div>
      <div className="text-sm  bg-white h-25 overflow-y-auto">
        <div className="flex items-center w-full bg-white">
          <IconButton
            className="inline-flex justify-center item  s-center group"
            aria-haspopup="true"
          >
            <div className="flex flex-row items-center text-center">
              <div className="flex items-center justify-center h-10 w-10 text-black rounded-2xl bg-primary300 font-bold uppercase text-xl">
                <span>
                  {props.localUser
                    ? props.localUser.nickname.substr(0, 1)
                    : null}
                </span>
              </div>
            </div>
          </IconButton>

          <div className="text-xl block overflow-hidden text-ellipsis whitespace-nowrap ">
            {props.localUser ? props.localUser.nickname : null}
          </div>
          <div
            className="ml-auto font-bold text-primarytext mr-1"
            onClick={() => props.handleOpen()}
          >
            이름 변경 {user.location}
          </div>
          <div className=" mr-2">
            {props.localUser && props.localUser.audioActive ? (
              <span>
                <Mic />
              </span>
            ) : (
              <span>
                <MicOff />
              </span>
            )}
            {props.localUser && props.localUser.videoActive ? (
              <span>
                <Videocam />
              </span>
            ) : (
              <span>
                <VideocamOff />
              </span>
            )}
          </div>
        </div>
        {props.subscribers.map((user, index) => (
          <div className="flex items-center w-full bg-white">
            <IconButton
              className="inline-flex justify-center item  s-center group"
              aria-haspopup="true"
            >
              <div className="flex flex-row items-center text-center">
                <div className="flex items-center justify-center h-10 w-10 text-black rounded-2xl bg-primary300 font-bold uppercase text-xl">
                  <span>
                    {user.userOBJ
                      ? user.nickname.substr(0, 1)
                      : user.nickname.substr(0, 1)}
                  </span>
                </div>
              </div>
            </IconButton>

            <div className="text-xl block overflow-hidden text-ellipsis whitespace-nowrap ">
              {user.userOBJ ? user.nickname : user.nickname}
            </div>
            <div className="ml-auto mr-2">
              {user && user.audioActive ? (
                <span>
                  <Mic />
                </span>
              ) : (
                <span>
                  <MicOff />
                </span>
              )}
              {user && user.videoActive ? (
                <span>
                  <Videocam />
                </span>
              ) : (
                <span>
                  <VideocamOff />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
export default MiniPeople
