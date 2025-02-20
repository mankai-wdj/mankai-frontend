import React, { Component, useEffect, useState } from 'react'
import {
  Avatar,
  Button,
  Card,
  IconButton,
  Link,
  Skeleton,
  TextField,
} from '@mui/material'
import BoardSide from './BoardSide'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import Modal from '@mui/material/Modal'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import ShareIcon from '@mui/icons-material/Share'
import SvgIcon from '@mui/material/SvgIcon'
import ChatIcon from '@mui/icons-material/Chat'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { red } from '@mui/material/colors'
import { useDispatch, useSelector } from 'react-redux'
import VisibilityIcon from '@mui/icons-material/Visibility'
import axios from 'axios'
import BoardImages from './BoardImages'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Moment from 'react-moment'
import { OptionUnstyled } from '@mui/base'
import 'react-dropdown/style.css'
import UseAnimations from 'react-useanimations'
import heart from 'react-useanimations/lib/heart'
import MyPostEditModal from './MyPostEditModal'
import settings2 from 'react-useanimations/lib/settings2'

function BoardCard(props) {
  const dispatch = useDispatch()
  const user = useSelector(state => state.Reducers.user)
  const sideBoard = useSelector(state => state.Reducers.sideData)
  const isOpen = useSelector(state => state.Reducers.isOpen)
  const likeUpdate = useSelector(state => state.Reducers.likeUpdate)
  const likeId = useSelector(state => state.Reducers.likeId)

  const [imageList, setImageList] = useState([])
  const [isLike, setIsLike] = useState(false)
  const [likes, setLikes] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [sampleComment, setSampleComment] = useState([])
  const [titlefieldvalue, setTitleFieldValue] = useState('')
  const [commentLength, setCommentLength] = useState('')
  const [translated, setTranslated] = useState('')
  const [profile, setProfile] = useState('')
  const [editModalOpen, setEditModalOpen] = useState(false)

  // 메뉴바 조절
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    maxHeight: 630,
    borderRadius: '10px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  const textChange = e => {
    setTitleFieldValue(e.target.value)
  }

  const handleClose = e => {
    let eText = e.target.outerText
    if (eText === '번역하기') {
      console.log('번역하기클릭')
      axios
        .post('/api/show/papago', {
          text: props.board.content_text,
          mycountry: user.country,
        })
        .then(res => {
          setTranslated(res.data.message.result.translatedText)
        })
    }
    if (eText === '삭제하기') {
      axios
        .post('/api/mypost/delete', {
          boardId: Number(props.board.id),
        })
        .then(res => {
          console.log(res)
          dispatch({
            type: 'BOARD_DELETE',
            payload: {
              boardId: props.board.id,
            },
          })
        })
        .catch(err => {
          console.log(err)
        })
    }

    if (eText === '수정하기') {
      setEditModalOpen(true)
    }

    if (eText === '클립보드로 이동') {
      setOpenModal(true)
    }
    setAnchorEl(null)
  }

  const BoardToSideData = e => {
    console.log(likes)
    dispatch({
      type: 'BOARD_CLICK',
      payload: {
        sideData: props.board,
        sideLikeData: likes,
        sideImageList: imageList,
      },
    })
    dispatch({ type: 'SIDE_OPEN' })
  }
  const ClickLike = () => {
    dispatch({
      type: 'LIKE_UPDATE',
      payload: {
        board_id: props.board.id,
      },
    })
    setIsLike(true)
    axios
      .post('/api/post/like', {
        user_id: user.id,
        board_id: props.board.id,
      })
      .then(res => {
        setLikes(res.data)
      })
  }
  const ClickDisLike = () => {
    dispatch({
      type: 'LIKE_UPDATE',
      payload: {
        board_id: props.board.id,
      },
    })
    setIsLike(false)
    axios
      .post('/api/delete/like', {
        user_id: user.id,
        board_id: props.board.id,
      })
      .then(res => {
        setLikes(res.data)
      })
  }

  const handleModalClose = () => {
    setOpenModal(false)
  }

  const submitMemo = titlefieldvalue => {
    axios
      .post('/api/storememo', {
        content_text: props.board.content_text,
        memo_title: titlefieldvalue,
        user_id: user.id,
        post_memo_id: props.board.id,
        memo_type: 'SNS',
      })
      // post_memo_id를 보낸게 MemoController에서 게시글에 딸린 이미지를 저장할 수 있게 해준다.
      .then(res => {
        console.log(res)
        dispatch({
          type: 'ADD_MEMO',
          payload: { memo: res.data },
        })
      })
      .catch(err => {
        console.log(err)
      })
    setTitleFieldValue('')
    handleModalClose()
  }

  useEffect(() => {
    if (likeId == props.board.id) {
      axios.get('/api/show/like/' + props.board.id).then(res => {
        console.log(res.data)
        setLikes(res.data)
      })
    }
  }, [likeUpdate])

  useEffect(() => {
    setIsLike(false)
    if (user && user.id) {
      likes.forEach(like => {
        if (user.id == like.user_id) {
          setIsLike(true)
        }
      })
    }
  }, [likes])

  // 통합 데이터 받기
  useEffect(() => {
    let check = 0
    setImageList([])
    if (check == 0) {
      axios
        .get('/api/upload_image/' + props.board.id)
        .then(function (res) {
          console.log(res.data)
          // 이미지와 댓글을 모두 받는다
          check = 1
          if (res.data.images.length === 0) setImageList('No Data')
          else
            for (let i = 0; i < res.data.images.length; i++) {
              setImageList(imageList => [...imageList, res.data.images[i].url])
            }
          setSampleComment(res.data.comments)
          setCommentLength(res.data.comment_length)
          setLikes(res.data.likes)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }, [props.board])

  const showBoardByEdit = () => {
    console.log('이게 일어남')
    window.location.reload()
  }

  const openEditModal = () => {
    setEditModalOpen(false)
  }

  return (
    <div className="w-full mx-auto max-w-3xl px-3 mb-5">
      <div>
        <div className="bg-white w-full rounded-2xl shadow-md mt-2">
          <div className="w-full h-16 ml-2 flex items-center flex justify-between ">
            <div className="w-full flex justify-between mt-10 py-1 px-4 mr-4 rounded-lg  border-2 border-gray-300">
              <div className="flex mt-1">
                {props.board.profile ? (
                  <Avatar src={props.board.profile} alt="" />
                ) : props.board.name ? (
                  <Avatar>{props.board.name.charAt(0)}</Avatar>
                ) : (
                  <CircularProgress />
                )}
                <div className="ml-3">
                  <h3 className="font-bold text-md">{props.board.name}</h3>
                  <p className="text-sm text-gray-500">
                    <Moment format="YYYY/MM/DD">
                      {props.board.updated_at}
                    </Moment>{' '}
                  </p>
                </div>
              </div>
              {/* 메뉴바 */}
              <div>
                <Modal
                  open={openModal}
                  onClose={handleModalClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <TextField
                      fullWidth
                      value={titlefieldvalue}
                      onChange={textChange}
                      multiline
                      maxRows={5}
                      id="standard-basic"
                      label="메모 제목을 적어주세요"
                      variant="standard"
                    />

                    <Button
                      onClick={() => {
                        submitMemo(titlefieldvalue)
                      }}
                      sx={{
                        ':hover': {
                          backgroundColor: '#6f53f0',
                        },
                        backgroundColor: '#4D2BF4',
                      }}
                      variant="contained"
                      className="submit_button"
                    >
                      메모저장
                    </Button>
                  </Box>
                </Modal>

                <MyPostEditModal
                  showBoardByEdit={showBoardByEdit}
                  editModalOpen={editModalOpen}
                  openEditModal={openEditModal}
                  memoContentText={props.board.content_text}
                  postId={props.board.id}
                />

                <UseAnimations
                  onClick={handleClick}
                  size={32}
                  animation={settings2}
                />
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={handleClose}>번역하기</MenuItem>
                  <MenuItem onClick={handleClose}>클립보드로 이동</MenuItem>
                  {user && user.id === Number(props.board.user_id) && (
                    <MenuItem onClick={handleClose}>수정하기</MenuItem>
                  )}
                  {user && user.id === Number(props.board.user_id) && (
                    <MenuItem onClick={handleClose}>삭제하기</MenuItem>
                  )}
                </Menu>
              </div>
            </div>
          </div>
          <div className="w-full mt-10 ">
            <div className="w-full mx-auto xl:px-16 px-10">
              {/* 게시글 사진및 본문내용 */}
              <p className="font-bold">{props.board.content_text}</p>

              <p className="bg-gray-200">{translated}</p>
              {imageList == '' ? (
                <Skeleton variant="rectangular" width={550} height={550} />
              ) : imageList != 'No Data' ? (
                <div className="mt-3">
                  <BoardImages imageList={imageList} />
                </div>
              ) : (
                <div></div>
              )}
            </div>
            {/* Down */}
            <div className="mx-auto px-10 mt-5">
              <div className="pb-4">
                <div className="flex">
                  <div className="w-1/3 grid grid-cols-2">
                    {isLike ? (
                      <Button color="error" onClick={ClickDisLike}>
                        <SvgIcon
                          color="error"
                          className="mx-auto"
                          component={FavoriteIcon}
                          fontSize="large"
                        />
                        <p>
                          {likes ? likes.length + likeCount : 0 + likeCount}
                        </p>
                      </Button>
                    ) : (
                      <Button color="error" onClick={ClickLike}>
                        <SvgIcon
                          color="action"
                          className="mx-auto"
                          component={FavoriteBorderIcon}
                          fontSize="large"
                        ></SvgIcon>
                        <p>
                          {likes ? likes.length + likeCount : 0 + likeCount}
                        </p>
                      </Button>
                    )}

                    {sideBoard.id === props.board.id && isOpen === true ? (
                      <Button variant="contained" disabled>
                        <SvgIcon
                          color="action"
                          className="mx-auto"
                          component={ChatIcon}
                          fontSize="large"
                        ></SvgIcon>
                      </Button>
                    ) : (
                      <Button onClick={BoardToSideData}>
                        <SvgIcon
                          color="action"
                          className="mx-auto"
                          component={ChatBubbleOutlineOutlinedIcon}
                          fontSize="large"
                        ></SvgIcon>
                      </Button>
                    )}
                  </div>
                  <div className="w-2/3 text-right">
                    <Button>
                      <SvgIcon
                        color="action"
                        className="mx-auto"
                        component={ShareIcon}
                        fontSize="large"
                      />
                    </Button>
                  </div>
                </div>

                <div className="px-12 mt-5  break-words">
                  {sampleComment.length > 0 ? (
                    <div>
                      {sampleComment.map(sample => {
                        return (
                          <div className="text-md text-gray-500">
                            {sample.user_name + ' : ' + sample.comment}
                          </div>
                        )
                      })}
                      <div className="text-center o text-sm mt-5  text-gray-500">
                        총 {commentLength}개의 댓글이 있습니다...
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-sm text-gray-500">
                      댓글이 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* <!-- 하트 이미지 및 댓글 갯수 --> */}
        </div>
      </div>
    </div>
  )
}

export default BoardCard
