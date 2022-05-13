import { CircularProgress, Grid, Link } from '@mui/material'
import { useSelector } from 'react-redux'
import VideoRoom from './VideoRoom'
import { useFullScreenHandle } from 'react-full-screen'
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from 'react-device-detect'
import MobileVideoRoom from './MobileVideoRoom'
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'
import { useEffect, useState } from 'react'
function WaitRoom(props) {
  const user = useSelector(state => state.Reducers.user)
  const loading = useSelector(state => state.Reducers.user_pending)
  const roomName = props.match.params.roomID
  const handle = useFullScreenHandle()
  const [subtitle, setSubtitle] = useState(null)
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    finalTranscript,
  } = useSpeechRecognition()

  useEffect(() => {
    if (listening && transcript) {
      console.log('인식 중 ㅋ' + transcript)
      setSubtitle(transcript)
    }
  }, [transcript, listening])
  useEffect(() => {
    if (subtitle) {
      console.log('인식 중 전달')
    }
  }, [subtitle])
  useEffect(() => {
    if (user) {
      SpeechRecognition.startListening({
        continuous: true,
        language: user.country,
      })
    }
    SpeechRecognition.startListening({ continuous: true, language: 'ko' })
  }, [user])
  return (
    <div>
      {user && !loading ? (
        <>
          <BrowserView>
            <VideoRoom
              user={user}
              roomName={roomName}
              handle={handle}
              location={user.country}
              subtitle={subtitle}
              resetTranscript={resetTranscript}
            ></VideoRoom>
          </BrowserView>
          <MobileView>
            <MobileVideoRoom
              user={user}
              roomName={roomName}
              handle={handle}
              location={user.country}
            ></MobileVideoRoom>
          </MobileView>
        </>
      ) : loading ? (
        <CircularProgress
          size={48}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-24px',
            marginLeft: '-24px',
          }}
        />
      ) : (
        <Grid container component="main" sx={{ height: '100vh' }}>
          <div className="w-full  bg-blue-100 flex items-center p-5 lg:p-20 overflow-hidden relative">
            <div className="flex-1 min-h-full min-w-full rounded-3xl bg-white shadow-xl p-10 lg:p-20 text-gray-800 relative md:flex items-center text-center md:text-left">
              <div className="w-full md:w-1/2">
                <div className="mb-10 md:mb-20 text-gray-600 font-light">
                  <h1 className="font-black  text-3xl lg:text-5xl text-indigo-700 mb-10">
                    401 Unauthorized
                  </h1>
                  <p> {roomName}번방에 접근할려면 로그인을 해야 합니다.</p>
                  <p>로그인을 해서 화상회의에 참여하세요.</p>
                </div>
                <div className="mb-20 md:mb-0">
                  <a href="/login">
                    <button className="text-lg font-light outline-none focus:outline-none transform transition-all hover:scale-110 text-blue-500 hover:text-blue-600">
                      로그인
                    </button>
                  </a>
                </div>
              </div>
            </div>
            <div className="w-64 md:w-96 h-96 md:h-full bg-blue-200 bg-opacity-30 absolute -top-64 md:-top-96 right-20 md:right-32 rounded-full pointer-events-none -rotate-45 transform"></div>
            <div className="w-96 h-full bg-indigo-200 bg-opacity-20 absolute -bottom-96 right-64 rounded-full pointer-events-none -rotate-45 transform"></div>
          </div>
        </Grid>
      )}
    </div>
  )
}

export default WaitRoom
