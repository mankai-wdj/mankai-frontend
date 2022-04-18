import React, { useEffect, useState, Suspense } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  Link,
} from 'react-router-dom'

import Login from './components/Login'
import Register from './components/Register'
import Mypage from './components/Mypage'
import BoardCopy from './components/BoardCopy'
import axios from 'axios'
import Home from './layouts/Home'
import Empty from './components/Empty'
import { useSelector, useDispatch } from 'react-redux'
import { User } from './store/modules/getUser'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Noti } from './store/modules/getNoti'
import NotiView from './components/NotiView'
import Dashboard from './components/Dashboard'
import Chat from './components/Chat/Chat'
import DashboardUser from './admin/component/User'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import './css/style.scss'
import Room from './components/WebRtc/VideoRoom'
import WaitRoom from './components/WebRtc/WaitRoom'
import speechTest from './components/stream/speechTest'
import Group from './components/Group'
import ChatMemo from './components/MyPage/ChatMemo'
import './css/style.scss'
import Profile from './components/MyPage/Profile'
import YouPage from './components/MyPage/YouPage'
import GroupDetail from './components/GroupDetail'
import firebase from 'firebase/app';
import "firebase/messaging"
axios.defaults.baseURL = 'http://localhost:8000/'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'
axios.defaults.withCredentials = true

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('auth_token')
  config.headers.Authorization = [token ? `Bearer ${token}` : '']
  return config
})

window.Pusher = require('pusher-js')
window.Echo = new Echo({
  broadcaster: 'pusher',
  key: 'anykey',
  cluster: 'ap3',
  forceTLS: false,
  wsHost: window.location.hostname,
  wsPort: 6001,
  authEndpoint: '/broadcasting/auth',
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
  auth: {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
    },
  },
})

function App() {
  const token = localStorage.getItem('auth_token')
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.Reducers.user);
  const firebaseMessaging = firebase.messaging();
  const currentRoom = useSelector(state => state.Reducers.currentRoom)
  const notiToken = useSelector(state => state.Reducers.noti_token)
  useEffect(() => {
    if(currentUser && notiToken) {
      const channel = window.Echo.channel('user.' + currentUser.id) // 채팅방 참여
      .listen('.user-connect', e => {
        // 여기서 fcm으로 보내주기 방번호 꼭 보내주기
        if(currentUser.id != e.message.user_id) {
          axios.post('api/fcm/message', {
            token : notiToken,
            body : e.message.message,
            user_id : e.message.user_id,
            room_id : e.message.room_id,
            type : e.message.type,
            serverKey : process.env.REACT_APP_FIREBASE_SERVER_KEY
          }).then(res => {
          })
        }
      })
      return () => {
        channel.subscription.unbind(
          channel.eventFormatter.format('.user-connect')
        )
      }
    }
    
  }, [currentUser, notiToken]);

  const getCurrentRoom = () => {
    return currentRoom;
  }
  const userName = (types, users) => {
    users = JSON.parse(users)
    // console.log((users));
    users = users.filter((user, index) => user.user_id !== currentUser.id)
    if (types === 'dm') {
      return users[0].user_name
    } else {
      var userNames = ''
      users = users.map((user, index) =>
        index !== users.length - 1
          ? (userNames += user.user_name + ',')
          : (userNames += user.user_name)
      )
      return userNames
    }
  }
  firebaseMessaging.onMessage(function(payload){
    if(getCurrentRoom() == null || getCurrentRoom().id != JSON.parse(payload.data.room).id) {
      // console.log(getCurrentRoom().id);
      const room = JSON.parse(payload.data.room)
      const sendUser = JSON.parse(payload.data.user)
      toast(
        <a href='http://localhost:3000/chat'>
          <div className='w-full mb-1 font-bold'>{userName(room.type, room.users)}</div>
          <hr />
          <div className='flex my-2'>
            <div className="">
              {sendUser.profile ? (
                <img
                  src={sendUser.profile_photo_url}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="flex items-center justify-center h-10 w-10 rounded-2xl bg-primary300 font-bold uppercase text-xl">
                  {sendUser.name.substring(0, 1)}
                </div>
              )}
            </div>
            <div className='flex-col'>
              <div className="text-left ml-2 my-auto">
                <span className='font-bold'>{sendUser.name}</span>
              </div>
              <div className='text-left ml-2 '>
                {payload.data.type == 'memo' ? 
                  JSON.parse(payload.notification.body).memo_title + ' 메모가 도착했습니다'
                  : payload.data.type == 'file' ?
                    (payload.notification.body.startsWith('[{') ? '파일이 도착했습니다' : "사진이 도착했습니다")
                    : payload.notification.body}
                
              </div>
            </div>
          </div>
        </a> , 
        {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      //확인 후 toast 띄워주기
    }
  })
  // useEffect(() => {
    
  //   console.log(notiToken);
  // }, [notiToken]);

  useEffect(() => {
    if (!token) {
    } else {
      dispatch(User())
      dispatch(Noti())
    }
  }, [token]);
  return (
    <Router>
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/mypage" component={Mypage}></Route>
        <Route exact path="/noti" component={NotiView}></Route>
        <Route exact path="/login">
          {true ? <Login /> : <Redirect to="/" />}
        </Route>
        <Route exact path="/register" component={Register}></Route>
        <Route exact path="/dashboard" component={Dashboard}></Route>
        <Route exact path="/dashboard/user" component={DashboardUser}></Route>
        <Route exact path="/chat" component={Chat}></Route>
        <Route exact path="/video/:roomID" component={WaitRoom}></Route>
        <Route exact path="/speak/test" component={speechTest}></Route>
        <Route
          exact
          path="/dashboard/user/:id"
          component={DashboardUser}
        ></Route>

        <Route exact path="/profile" component={Profile}></Route>
        <Route exact path="/youpage/:follow_id" component={YouPage}></Route>
        <Route exact path="/chatting_memo" component={ChatMemo}></Route>
        {/* <Route exact path="/post_memo" component={PostMemo}></Route>
          <Route exact path="/my_memo_edit/:id" component={MyMemoEdit}></Route> */}

        <Route exact path="/youProfile" component={YouPage}></Route>

        <Route exact path="/board" component={BoardCopy}></Route>

        <Route exact path="/group" component={Group}></Route>
        <Route exact path="/group/:group_id" component={GroupDetail}></Route>
        <Route path="*" component={Empty}></Route>
      </Switch>
    </Router>
  )
}

export default App
