import axios from 'axios'
import { useSelector } from 'react-redux'

const SET_FCM_TOKEN_PENDING = 'SET_FCM_TOKEN_PENDING'
const SET_FCM_TOKEN_FAILURE = 'SET_FCM_TOKEN_FAILURE'

function getAPI(userId, token) {
  return axios.post(`/api/set/fcmToken/${userId}`, {"fcm_token" : token})
}

export const setFcmToken = (userId, token) => async dispatch => {
  //먼저 요청이 시작 됬다는것을 알려줌

  dispatch({ type: SET_FCM_TOKEN_PENDING })
  // 요청을 시작합니다
  // 여기서 만든 promise 를 return 해줘야, 나중에 컴포넌트에서 호출 할 때 getPost().then(...) 을 할 수 있습니다
  return getAPI(userId, token)
    .then(res => {
      //요청이 성공하면 서버 응답내용을 payload 로 설정하여 GET_USER_SUCCESS 액션을 디스패치합니다.
        console.log("fcm_token set");
    })
    .catch(err => {
      // 에러가 발생할경우  GET_USER_FAILURE
      dispatch({
        type: SET_FCM_TOKEN_FAILURE,
        payload: err,
      })
      throw err
    })
}
