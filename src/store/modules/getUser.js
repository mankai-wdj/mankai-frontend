import axios from 'axios'
import { getFollows } from './getFollows'
import { getFollowers } from './getFollowers'
import { getMemo } from './getMemo'
import { Users } from './getUsers'
import firebase from 'firebase/app'
import 'firebase/messaging'
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'mankai-project.firebaseapp.com',
  projectId: 'mankai-project',
  storageBucket: 'mankai-project.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}
let firebaseMessaging = null
firebase.initializeApp(firebaseConfig)

if (firebase.messaging.isSupported()) {
  firebaseMessaging = firebase.messaging()
}
const GET_USER_PENDING = 'GET_USER_PENDING'
const GET_USER_SUCCESS = 'GET_USER_SUCCESS'
const GET_USER_FAILURE = 'GET_USER_FAILURE'

function getAPI() {
  return axios.get('/api/user')
}

export const User = () => async dispatch => {
  //먼저 요청이 시작 됬다는것을 알려줌

  dispatch({ type: GET_USER_PENDING })
  // 요청을 시작합니다
  // 여기서 만든 promise 를 return 해줘야, 나중에 컴포넌트에서 호출 할 때 getPost().then(...) 을 할 수 있습니다
  return getAPI()
    .then(res => {
      //요청이 성공하면 서버 응답내용을 payload 로 설정하여 GET_USER_SUCCESS 액션을 디스패치합니다.
      dispatch({
        type: GET_USER_SUCCESS,
        payload: res.data,
      })
      dispatch(getFollows(res.data.id))
      dispatch(getFollowers(res.data.id))
      dispatch(getMemo(res.data.id))

      firebaseMessaging
        .requestPermission()
        .then(() => {
          console.log('허가!')
          return firebaseMessaging.getToken() // 등록 토큰 받기
        })
        .then(function (token) {
          dispatch({ type: 'SET_NOTI_TOKEN', payload: { noti_token: token } })
          console.log(token) //토큰 출력
        })
        .catch(function (error) {
          console.log('FCM Error : ', error)
        })
      dispatch(Users())
    })
    .catch(err => {
      // 에러가 발생할경우  GET_USER_FAILURE
      dispatch({
        type: GET_USER_FAILURE,
        payload: err,
      })
      throw err
    })
}
