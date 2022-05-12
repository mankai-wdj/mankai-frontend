import React, { useEffect, useRef, useState, Component } from 'react'

import { OpenVidu } from 'openvidu-browser'
import axios from 'axios'
import StreamComponent from '../stream/StreamComponent'
import './Room.css'
import UserModel from '../../models/user-model'
import ToolbarComponent from '../toolbar/ToolbarComponent'
import Header from '../../admin/layout/Header'
import { IconButton } from '@mui/material'
import ChangeNameModal from './ChangeNameModal'
import Chat from './Chat'
import MiniChat from './MiniChat'
import Mic from '@mui/icons-material/Mic'
import MicOff from '@mui/icons-material/MicOff'
import Videocam from '@mui/icons-material/Videocam'
import VideocamOff from '@mui/icons-material/VideocamOff'

import Ratio from 'react-ratio/lib/Ratio'
import VideoOptionModal from './VideoOptionModal'
var localUser = new UserModel()
const RoomAxios = axios.create()
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()
mic.continuous = true
mic.interimResults = false

class VideoRoom extends Component {
  constructor(props) {
    super(props)
    this.OPENVIDU_SERVER_URL = process.env.REACT_APP_OPENVIDU_SERVER_URL
    this.OPENVIDU_SERVER_SECRET = process.env.REACT_APP_OPENVIDU_SERVER_SECRET
    this.hasBeenUpdated = false
    this.initLayoutContainer = window.initLayoutContainer
    let sessionName = this.props.roomName
    let userName = this.props.user
      ? this.props.user.name
      : 'Mankai' + Math.floor(Math.random() * 100)
    let userInfo = this.props.user
    this.remotes = []
    this.localUserAccessAllowed = false
    this.state = {
      mySessionId: sessionName,
      myUserName: userName,
      session: undefined,
      screenSession: undefined,
      localUser: undefined,
      openModal: false,
      subscribers: [],
      chatDisplay: 'none',
      userInfo: userInfo,
      currentVideoDevice: undefined,
      sst: undefined,
      langCode: userInfo.country,
      speaking: false,
      tokenValue: undefined,
      currentPage: 1,
      subscribersPage: 1,
      openVideoOptionModal: false,
      videoStream: undefined,
    }
    this.joinSession = this.joinSession.bind(this)
    this.leaveSession = this.leaveSession.bind(this)
    this.onbeforeunload = this.onbeforeunload.bind(this)
    this.updateLayout = this.updateLayout.bind(this)
    this.camStatusChanged = this.camStatusChanged.bind(this)
    this.handlePaginate = this.handlePaginate.bind(this)
    this.handlePage = this.handlePage.bind(this)
    this.micStatusChanged = this.micStatusChanged.bind(this)
    this.captionTranslate = this.captionTranslate.bind(this)
    this.nicknameChanged = this.nicknameChanged.bind(this)
    this.toggleFullscreen = this.toggleFullscreen.bind(this)
    this.switchCamera = this.switchCamera.bind(this)
    this.screenShare = this.screenShare.bind(this)
    this.stopScreenShare = this.stopScreenShare.bind(this)
    this.closeDialogExtension = this.closeDialogExtension.bind(this)
    this.toggleChat = this.toggleChat.bind(this)
    this.checkNotification = this.checkNotification.bind(this)
    this.checkSize = this.checkSize.bind(this)
    this.setOpenModal = this.setOpenModal.bind(this)
    this.setOptionModal = this.setOptionModal.bind(this)
    this.closeOptionModal = this.closeOptionModal.bind(this)
    this.closeOpenModal = this.closeOpenModal.bind(this)
    this.getPermissions = this.getPermissions.bind(this)
  }

  componentDidMount() {
    const options = {
      maxRatio: 3 / 2, // The narrowest ratio that will be used (default 2x3)
      minRatio: 9 / 16, // The widest ratio that will be used (default 16x9)
      fixedRatio: false, // If this is true then the aspect ratio of the video is maintained and minRatio and maxRatio are ignored (default false)
      scaleLastRow: true, // If there are less elements on the last row then we can scale them up to take up more space
      alignItems: 'center', // Can be 'start', 'center' or 'end'. Determines where to place items when on a row or column that is not full
      bigClass: 'OT_big', // The class to add to elements that should be sized bigger
      bigPercentage: 0.8, // The maximum percentage of space the big ones should take up
      minBigPercentage: 0, // If this is set then it will scale down the big space if there is left over whitespace down to this minimum size
      bigFixedRatio: false, // fixedRatio for the big ones
      bigScaleLastRow: true, // scale last row for the big elements
      bigAlignItems: 'center', // How to align the big items
      smallAlignItems: 'center', // How to align the small row or column of items if there is a big one
      maxWidth: Infinity, // The maximum width of the elements
      maxHeight: Infinity, // The maximum height of the elements
      smallMaxWidth: Infinity, // The maximum width of the small elements
      smallMaxHeight: Infinity, // The maximum height of the small elements
      bigMaxWidth: Infinity, // The maximum width of the big elements
      bigMaxHeight: Infinity, // The maximum height of the big elements
      bigMaxRatio: 3 / 2, // The narrowest ratio to use for the big elements (default 2x3)
      bigMinRatio: 9 / 16, // The widest ratio to use for the big elements (default 16x9)
      bigFirst: true, // Whether to place the big one in the top left (true) or bottom right (false).
      // You can also pass 'column' or 'row' to change whether big is first when you are in a row (bottom) or a column (right) layout
      animate: false, // Whether you want to animate the transitions using jQuery (not recommended, use CSS transitions instead)
      window: window, // Lets you pass in your own window object which should be the same window that the element is in
      ignoreClass: 'OT_ignore', // Elements with this class will be ignored and not positioned. This lets you do things like picture-in-picture
      onLayout: null, // A
    }
    this.layoutContainer = document.getElementById('layout')
    this.layout = this.initLayoutContainer(this.layoutContainer, options).layout
    this.getPermissions()
    window.addEventListener('beforeunload', this.onbeforeunload)
    window.addEventListener('resize', this.updateLayout)
    window.addEventListener('resize', this.checkSize)
    mic.lang = this.state.langCode
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onbeforeunload)
    window.removeEventListener('resize', this.updateLayout)
    window.removeEventListener('resize', this.checkSize)

    this.leaveSession()
  }

  onbeforeunload(event) {
    this.leaveSession()
  }

  joinSession() {
    this.OV = new OpenVidu()
    this.OVScreen = new OpenVidu()
    this.OV.setAdvancedConfiguration({
      interval: 20, // Frequency of the polling of audio streams in ms (default 100)
      threshold: 50, // Threshold volume in dB (default -50)
    })
    this.setState(
      {
        session: this.OV.initSession(),
        screenSession: this.OVScreen.initSession(),
      },
      () => {
        this.subscribeToStreamCreated()
        this.connectToSession()
        this.screenConnectToSession()
      }
    )
  }

  connectToSession() {
    if (this.props.token !== undefined) {
      console.log('token received: ', this.props.token)
      this.connect(this.props.token)
    } else {
      this.getToken()
        .then(token => {
          console.log(token)
          this.connect(token)
          this.setState({ tokenValue: token })
        })
        .catch(error => {
          if (this.props.error) {
            this.props.error({
              error: error.error,
              messgae: error.message,
              code: error.code,
              status: error.status,
            })
          }
          console.log(
            'There was an error getting the token:',
            error.code,
            error.message
          )
          alert('There was an error getting the token:', error.message)
        })
    }
  }

  handlePaginate(event) {
    this.setState({
      currentPage: Number(event),
    })
  }

  handlePage(event) {
    if (event == 'minus') {
      this.setState({
        currentPage: this.state.currentPage - 1,
      })
      console.log('-')
    } else {
      this.setState({
        currentPage: this.state.currentPage + 1,
      })
      console.log('+')
    }
  }

  screenConnectToSession() {
    if (this.props.token !== undefined) {
      console.log('token received: ', this.props.token)
      this.connect(this.props.token)
    } else {
      this.getToken()
        .then(token => {
          console.log(token)
          this.ScreenConnect(token)
        })
        .catch(error => {
          if (this.props.error) {
            this.props.error({
              error: error.error,
              messgae: error.message,
              code: error.code,
              status: error.status,
            })
          }
          console.log(
            'There was an error getting the token:',
            error.code,
            error.message
          )
          alert('There was an error getting the token:', error.message)
        })
    }
  }
  connect(token) {
    this.state.session
      .connect(token, {
        clientData: this.props.user.name,
        userOBJ: this.props.user,
      })
      .then(() => {
        this.connectWebCam()
        this.layout()
      })
      .catch(error => {
        if (this.props.error) {
          this.props.error({
            error: error.error,
            messgae: error.message,
            code: error.code,
            status: error.status,
          })
        }
        alert('There was an error connecting to the session:', error.message)
        console.log(
          'There was an error connecting to the session:',
          error.code,
          error.message
        )
      })
  }

  ScreenConnect(token) {
    this.state.screenSession
      .connect(token, {
        clientData: this.props.user.name,
        userOBJ: this.props.user,
      })
      .then(() => {
        console.log('스크린 연결')
      })
      .catch(error => {
        if (this.props.error) {
          this.props.error({
            error: error.error,
            messgae: error.message,
            code: error.code,
            status: error.status,
          })
        }
        alert('There was an error connecting to the session:', error.message)
        console.log(
          'There was an error connecting to the session:',
          error.code,
          error.message
        )
      })
  }
  getPermissions = () => {
    return new Promise((res, rej) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(stream => {
          this.joinSession()
        })
        .catch(err => {
          alert('카메라나 오디오 권한을 확인해주세요 게스트모드로 접근')
          this.joinSession()
        })
    })
  }
  async connectWebCam() {
    var devices = await this.OV.getDevices()
    var videoDevices = devices.filter(device => device.kind === 'videoinput')
    this.setState({ videoStream: videoDevices[0] })
    let publisher = this.OV.initPublisher(undefined, {
      audioSource: undefined,
      videoSource: videoDevices[0].deviceId,
      publishAudio: localUser.isAudioActive(),
      publishVideo: localUser.isVideoActive(),
      resolution: '1920x1080',
      frameRate: 30,
      insertMode: 'append',
      mirror: true,
    })
    publisher.on('publisherStartSpeaking', event => {
      if (this.state.speaking == false) {
        try {
          mic.start()
          this.setState({ speaking: true })
        } catch {}
      }
      console.log('로컬 유저')
      localUser.setSpeaking(true)
      this.sendSignalUserChanged({ speaking: true })
    })

    publisher.on('publisherStopSpeaking', event => {
      if (this.state.speaking == true) {
        try {
          mic.stop()
          this.setState({ speaking: false })
        } catch {}
      }
      console.log('로컬 유저 말안함 ㅎ')
      localUser.setSpeaking(false)
      this.sendSignalUserChanged({ speaking: false })
    })

    if (this.state.session.capabilities.publish) {
      publisher.on('accessAllowed', () => {
        let transcript = null

        this.state.session.publish(publisher).then(() => {
          this.updateSubscribers()
          this.localUserAccessAllowed = true
          if (this.props.joinSession) {
            this.props.joinSession()
          }
        })
      })
    }

    mic.onstart = () => {
      console.log('mics on')
      this.setState({ speaking: true })
    }
    mic.onend = () => {
      this.setState({ speaking: false })
    }
    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      this.sendSignalUserChanged({ caption: transcript })
      localUser.setCaption(transcript)
      mic.onerror = event => {
        console.log(event.error)
      }
    }
    localUser.setNickname(this.state.myUserName)
    localUser.setUserOBJ(this.props.user)
    localUser.setConnectionId(this.state.session.connection.connectionId)
    localUser.setScreenShareActive(false)
    localUser.setStreamManager(publisher)
    this.subscribeToUserChanged()
    this.subscribeToStreamDestroyed()
    this.sendSignalUserChanged({
      isScreenShareActive: localUser.isScreenShareActive(),
    })

    this.setState(
      { currentVideoDevice: videoDevices[0], localUser: localUser },
      () => {
        this.state.localUser.getStreamManager().on('streamPlaying', e => {
          this.updateLayout()
          publisher.videos[0].video.parentElement.classList.remove(
            'custom-class'
          )
        })
      }
    )
  }

  captionTranslate(text, user) {
    console.log('번역실행' + text)
    axios
      .post('/api/translate/text', {
        country: this.props.user.country,
        text: text,
      })
      .then(res => {
        console.log(res.data)
        user.setCaptionTranslate(res.data)
        this.sendSignalUserChanged({ translateUpdate: true })
      })
  }
  updateSubscribers() {
    var subscribers = this.remotes
    this.setState(
      {
        subscribers: subscribers,
      },
      () => {
        if (this.state.localUser) {
          this.sendSignalUserChanged({
            isAudioActive: this.state.localUser.isAudioActive(),
            isVideoActive: this.state.localUser.isVideoActive(),
            speaking: this.state.localUser.isSpeaking(),
            caption: this.state.localUser.getCaption(),
            captionTranslate: this.state.localUser.getCaptionTranslate(),
            nickname: this.state.localUser.getNickname(),
            userOBJ: this.state.localUser.getUserOBJ(),
            captionOn: this.state.localUser.getCaptionOnOff(),
            isScreenShareActive: this.state.localUser.isScreenShareActive(),
          })
        }
        this.updateLayout()
      }
    )
  }

  leaveSession() {
    const mySession = this.state.session
    try {
      mic.stop()
    } catch {}
    if (mySession) {
      mySession.disconnect()
    }
    if (this.state.screenSession) {
      this.state.screenSession.disconnect()
    }
    // Empty all properties...
    this.OV = null
    this.OVScreen = null
    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: 'SessionA',
      myUserName: 'OpenVidu_User' + Math.floor(Math.random() * 100),
      localUser: undefined,
    })
    if (this.props.leaveSession) {
      this.props.leaveSession()
    }
  }
  camStatusChanged() {
    localUser.setVideoActive(!localUser.isVideoActive())
    localUser.getStreamManager().publishVideo(localUser.isVideoActive())
    this.sendSignalUserChanged({ isVideoActive: localUser.isVideoActive() })
    this.setState({ localUser: localUser })
  }

  micStatusChanged() {
    localUser.setAudioActive(!localUser.isAudioActive())
    localUser.getStreamManager().publishAudio(localUser.isAudioActive())
    this.sendSignalUserChanged({ isAudioActive: localUser.isAudioActive() })
    this.setState({ localUser: localUser })
  }

  nicknameChanged(nickname) {
    let localUser = this.state.localUser
    localUser.setNickname(nickname)
    this.setState({ localUser: localUser })
    this.sendSignalUserChanged({ nickname: this.state.localUser.getNickname() })
  }

  deleteSubscriber(stream) {
    const remoteUsers = this.state.subscribers
    const userStream = remoteUsers.filter(
      user => user.getStreamManager().stream === stream
    )[0]
    let index = remoteUsers.indexOf(userStream, 0)
    if (index > -1) {
      remoteUsers.splice(index, 1)
      this.setState({
        subscribers: remoteUsers,
      })
    }
  }

  subscribeToStreamCreated() {
    this.state.session.on('streamCreated', event => {
      console.log(event)
      const subscriber = this.state.session.subscribe(event.stream, undefined)
      // var subscribers = this.state.subscribers;
      subscriber.on('streamPlaying', e => {
        this.checkSomeoneShareScreen()
        subscriber.videos[0].video.parentElement.classList.remove(
          'custom-class'
        )
      })

      const newUser = new UserModel()
      newUser.setStreamManager(subscriber)
      newUser.setConnectionId(event.stream.connection.connectionId)
      newUser.setType('remote')
      const nickname = event.stream.connection.data.split('%')[0]
      newUser.setNickname(JSON.parse(nickname).clientData)
      newUser.setUserOBJ(JSON.parse(nickname).userOBJ)
      this.remotes.push(newUser)
      if (this.localUserAccessAllowed) {
        this.updateSubscribers()
      }
    })
  }

  subscribeToStreamDestroyed() {
    // On every Stream destroyed...
    this.state.session.on('streamDestroyed', event => {
      // Remove the stream from 'subscribers' array
      this.deleteSubscriber(event.stream)
      setTimeout(() => {
        this.checkSomeoneShareScreen()
      }, 20)
      event.preventDefault()
      this.layout()
    })
  }

  subscribeToUserChanged() {
    this.state.session.on('signal:userChanged', event => {
      let remoteUsers = this.state.subscribers
      remoteUsers.forEach(user => {
        if (user.getConnectionId() === event.from.connectionId) {
          const data = JSON.parse(event.data)
          console.log('EVENTO REMOTE: ', event.data)
          if (data.isAudioActive !== undefined) {
            user.setAudioActive(data.isAudioActive)
          }
          if (data.isVideoActive !== undefined) {
            user.setVideoActive(data.isVideoActive)
          }
          if (data.nickname !== undefined) {
            user.setNickname(data.nickname)
          }
          if (data.user !== undefined) {
            user.setUserOBJ(data.user)
          }
          if (data.speaking !== undefined) {
            user.setSpeaking(data.speaking)
          }
          if (data.caption !== undefined) {
            user.setCaption(data.caption)
          }
          if (data.caption !== undefined) {
            this.captionTranslate(data.caption, user)
          }
          if (data.isScreenShareActive !== undefined) {
            user.setScreenShareActive(data.isScreenShareActive)
          }
        }
      })
      this.setState(
        {
          subscribers: remoteUsers,
        },
        () => this.checkSomeoneShareScreen()
      )
    })
  }

  updateLayout() {
    setTimeout(() => {
      this.layout()
    }, 20)
  }

  setOpenModal = () => {
    this.setState({ openModal: true })
  }
  closeOpenModal = () => {
    this.setState({ openModal: false })
  }
  setOptionModal = () => {
    this.setState({ openVideoOptionModal: true })
  }
  closeOptionModal = () => {
    this.setState({ openVideoOptionModal: false })
  }
  sendSignalUserChanged(data) {
    const signalOptions = {
      data: JSON.stringify(data),
      type: 'userChanged',
    }
    this.state.session.signal(signalOptions)
  }

  toggleFullscreen() {
    const document = window.document
    const fs = document.getElementById('container')
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (fs.requestFullscreen) {
        fs.requestFullscreen()
      } else if (fs.msRequestFullscreen) {
        fs.msRequestFullscreen()
      } else if (fs.mozRequestFullScreen) {
        fs.mozRequestFullScreen()
      } else if (fs.webkitRequestFullscreen) {
        fs.webkitRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    }
  }

  async switchCamera(videoDevice, audioDevice) {
    try {
      this.setState({ videoStream: videoDevice })
      // Creating a new publisher with specific videoSource
      // In mobile devices the default and first camera is the front one
      var newPublisher = this.OV.initPublisher(undefined, {
        audioSource: undefined,
        videoSource: videoDevice,
        publishAudio: localUser.isAudioActive(),
        publishVideo: localUser.isVideoActive(),
        mirror: false,
      })

      //newPublisher.once("accessAllowed", () => {
      await this.state.session.unpublish(
        this.state.localUser.getStreamManager()
      )
      await this.state.session.publish(newPublisher)
      this.state.localUser.setStreamManager(newPublisher)
      this.setState({
        currentVideoDevice: videoDevice,
        localUser: localUser,
      })
    } catch (e) {
      console.error(e)
    }
  }
  handleDblClick = e => {
    const layoutDivs = document.querySelectorAll('.ot-layout')
    const el = e.target.closest('.ot-layout')

    if (el.classList.contains('OT_big')) {
      el.classList.remove('OT_big')
    } else {
      for (let i = 0; i < layoutDivs.length; i++) {
        layoutDivs[i].classList.remove('OT_big')
      }
      el.classList.add('OT_big')
    }

    this.layout()
  }

  async screenShare() {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      audio: {
        autoGainControl: false,
        echoCancellation: false,
        googAutoGainControl: false,
        noiseSuppression: false,
      },
      video: true,
    })

    // const videoSource =
    //   navigator.userAgent.indexOf('chrome') !== -1 ? 'window' : 'screen'

    const publisher = this.OVScreen.initPublisher(
      undefined,
      {
        audioSource: stream.getAudioTracks()[0],
        videoSource: stream.getVideoTracks()[0],
        publishAudio: true,
        publishVideo: true,
        mirror: false,
      },
      error => {
        if (error && error.name === 'SCREEN_EXTENSION_NOT_INSTALLED') {
          this.setState({ showExtensionDialog: true })
        } else if (error && error.name === 'SCREEN_SHARING_NOT_SUPPORTED') {
          alert('Your browser does not support screen sharing')
        } else if (error && error.name === 'SCREEN_EXTENSION_DISABLED') {
          alert('You need to enable screen sharing extension')
        } else if (error && error.name === 'SCREEN_CAPTURE_DENIED') {
          alert('You need to choose a window or application to share')
        }
      }
    )

    publisher.once('accessAllowed', () => {
      // this.state.session.unpublish(localUser.getStreamManager())
      publisher.stream.getMediaStream().getVideoTracks()[0].contentHint =
        'detail' // 스크렌쉐어 낮은 fps 나오는거 문제 해결
      localUser.setScreenStreamManager(publisher)
      this.state.screenSession
        .publish(localUser.getScreenStreamManager())
        .then(() => {
          localUser.setScreenShareActive(true)
          this.layout()
          this.setState({ localUser: localUser }, () => {
            this.sendSignalUserChanged({
              isScreenShareActive: localUser.isScreenShareActive(),
            })
          })
        })

      publisher.stream
        .getMediaStream()
        .getVideoTracks()[0]
        .addEventListener('ended', () => {
          console.log('화면 공유 중지')
          this.stopScreenShare()
          // You can send a signal with Session.signal method to warn other participants
        })
    })
    publisher.on('streamPlaying', () => {
      this.updateLayout()
      publisher.videos[0].video.parentElement.classList.remove('custom-class')
    })
  }

  closeDialogExtension() {
    this.setState({ showExtensionDialog: false })
  }

  stopScreenShare() {
    localUser.setScreenShareActive(false)
    this.state.screenSession.unpublish(localUser.getScreenStreamManager())
    this.updateSubscribers()
    this.connectWebCam()
    this.layout()
  }

  checkSomeoneShareScreen() {
    let isScreenShared
    // return true if at least one passes the test
    isScreenShared =
      this.state.subscribers.some(user => user.isScreenShareActive()) ||
      localUser.isScreenShareActive()
    // const openviduLayoutOptions = {
    //   maxRatio: 3 / 2,
    //   minRatio: 9 / 16,
    //   fixedRatio: isScreenShared,
    //   bigClass: 'OV_big',
    //   bigPercentage: 0.6,
    //   bigFixedRatio: false,
    //   bigMaxRatio: 3 / 2,
    //   bigMinRatio: 9 / 16,
    //   bigFirst: true,
    //   animate: true,
    // }
    // this.layout.setLayoutOptions(openviduLayoutOptions)
    this.updateLayout()
  }

  toggleChat(property) {
    let display = property

    if (display === undefined) {
      display = this.state.chatDisplay === 'none' ? 'block' : 'none'
    }
    if (display === 'block') {
      this.setState({ chatDisplay: display, messageReceived: false })
    } else {
      console.log('chat', display)
      this.setState({ chatDisplay: display })
    }
    this.updateLayout()
  }

  checkNotification(event) {
    this.setState({
      messageReceived: this.state.chatDisplay === 'none',
    })
  }
  checkSize() {
    if (
      document.getElementById('layout').offsetWidth <= 700 &&
      !this.hasBeenUpdated
    ) {
      this.toggleChat('none')
      this.hasBeenUpdated = true
    }
    if (
      document.getElementById('layout').offsetWidth > 700 &&
      this.hasBeenUpdated
    ) {
      this.hasBeenUpdated = false
    }
  }

  render() {
    const mySessionId = this.state.mySessionId
    const localUser = this.state.localUser
    var chatDisplay = { display: this.state.chatDisplay }
    const { subscribers, currentPage, subscribersPage } = this.state
    // Logic for displaying current todos
    const indexOfLastSubscribers = currentPage * subscribersPage
    const indexOfFirstSubscribers = indexOfLastSubscribers - subscribersPage
    const currentSubscribers = subscribers.slice(
      indexOfFirstSubscribers,
      indexOfLastSubscribers
    )

    // Logic for displaying page numbers
    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(subscribers.length / subscribersPage); i++) {
      pageNumbers.push(i)
    }

    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <button
          key={number}
          id={number}
          onClick={() => this.handlePaginate(number)}
          class={
            currentPage == number
              ? 'w-3 h-3 flex justify-center items-center  cursor-pointer leading-5 transition duration-150 ease-in rounded-full bg-gray-800 text-white hover:text-gray-50 hover:bg-gray-700'
              : 'w-3 h-3 flex justify-center items-center  cursor-pointer leading-5 transition duration-150 ease-in bg-gray-200 rounded-full hover:bg-gray-400 hover:text-gray-50 '
          }
        >
          &nbsp;
        </button>
      )
    })
    return (
      <div className="flex  h-screen overflow-hidden">
        <div className="relative flex flex-col flex-1 h-screen  overflow-x-hidden">
          {/*  Site header */}
          <Header />
          <ChangeNameModal
            open={this.state.openModal}
            user={localUser}
            handleNickname={this.nicknameChanged}
            handleClose={this.closeOpenModal}
          />
          <VideoOptionModal
            open={this.state.openVideoOptionModal}
            handleCamera={this.switchCamera}
            selectedCamera={this.state.videoStream}
            handleClose={this.closeOptionModal}
          />
          <div className="flex w-full h-full">
            <div className="flex flex-col w-full h-full">
              <div id="container" className="flex flex-col h-full w-full">
                <div
                  id="layout"
                  className="bounds "
                  onDoubleClick={this.handleDblClick}
                >
                  {currentPage - 1 >= Number(pageNumbers[0]) ? (
                    <div className="opacity-60 bg-primarybg text-3xl font-bold border-r-4 border-primary text-orange-dark p-2 OT_ignore fixed absolute top-1/2 left-0 z-50 my-auto">
                      <button
                        className="bg-red"
                        onClick={() => this.handlePage('minus')}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%"
                          height="100%"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="feather feather-chevron-left w-6 h-6"
                        >
                          <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                      </button>
                    </div>
                  ) : null}

                  {currentPage + 1 <=
                  Number(pageNumbers[pageNumbers.length - 1]) ? (
                    <div className="opacity-60 bg-primarybg text-3xl font-bold border-r-4 border-primary text-orange-dark p-2 OT_ignore fixed absolute top-1/2 right-0 z-50 my-auto">
                      <button
                        className="bg-red  "
                        onClick={() => this.handlePage('plus')}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%"
                          height="100%"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="feather feather-chevron-right w-6 h-6"
                        >
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                    </div>
                  ) : null}
                  <div class="flex h-12 font-medium rounded-full space-x-3 absolute bottom-0 justify-center items-center w-full OT_ignore z-50">
                    {renderPageNumbers}
                  </div>
                  {localUser !== undefined &&
                    localUser.getStreamManager() !== undefined && (
                      <div id="localUser" className="m-auto">
                        <StreamComponent
                          user={localUser}
                          handleNickname={this.nicknameChanged}
                        />
                      </div>
                    )}
                  {currentSubscribers.map((sub, i) => (
                    <div key={i} id="remoteUsers" className="m-auto">
                      <StreamComponent
                        user={sub}
                        isMute={
                          sub.userOBJ.id === localUser.userOBJ.id ? true : false
                        }
                        streamId={sub.streamManager.stream.streamId}
                      />
                    </div>
                  ))}

                  {localUser !== undefined &&
                    localUser.getStreamManager() !== undefined && (
                      <div
                        className="OT_root OT_publisher custom-class"
                        style={chatDisplay}
                      >
                        <div
                          className="OT_root OT_publisher custom-class"
                          style={chatDisplay}
                        >
                          <Ratio ratio={16 / 9}>
                            <MiniChat
                              user={localUser}
                              chatDisplay={this.state.chatDisplay}
                              close={this.toggleChat}
                              messageReceived={this.checkNotification}
                              roomID={this.props.roomName}
                            />
                          </Ratio>
                        </div>
                      </div>
                    )}
                </div>
                <ToolbarComponent
                  sessionId={mySessionId}
                  user={localUser}
                  showNotification={this.state.messageReceived}
                  camStatusChanged={this.camStatusChanged}
                  micStatusChanged={this.micStatusChanged}
                  screenShare={this.screenShare}
                  stopScreenShare={this.stopScreenShare}
                  toggleFullscreen={this.toggleFullscreen}
                  switchCamera={this.switchCamera}
                  leaveSession={this.leaveSession}
                  toggleChat={this.toggleChat}
                />
              </div>
            </div>
            <div className="w-full w-1/3 bg-videochatbg">
              <div className=" font-bold text-sm text-left p-2">
                <div className="flex w-full">
                  <span className="px-2 py-1 text-sm font-bold text-blue-900  rounded-md ">
                    {this.props.roomName} 대화상대{' '}
                    {this.state.subscribers.length + 1}명
                  </span>
                  <button className="ml-auto p-1 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
                    방 공유
                  </button>
                  <button
                    className="ml-auto p-1 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => this.setOptionModal(true)}
                  >
                    설정
                  </button>
                </div>
                <div className="text-sm  bg-white h-40 overflow-y-auto">
                  <div className="flex items-center w-full bg-white">
                    <IconButton
                      className="inline-flex justify-center item  s-center group"
                      aria-haspopup="true"
                    >
                      <div className="flex flex-row items-center text-center">
                        <div className="flex items-center justify-center h-10 w-10 text-black rounded-2xl bg-primary300 font-bold uppercase text-xl">
                          <span>
                            {localUser ? localUser.nickname.substr(0, 1) : null}
                          </span>
                        </div>
                      </div>
                    </IconButton>

                    <div className="text-xl block overflow-hidden text-ellipsis whitespace-nowrap ">
                      {localUser ? localUser.nickname : null}
                    </div>
                    <div
                      className="ml-auto font-bold text-primarytext mr-1"
                      onClick={() => this.setOpenModal()}
                    >
                      이름 변경 {this.props.user.location}
                    </div>
                    <div className=" mr-2">
                      {localUser && localUser.audioActive ? (
                        <span>
                          <Mic />
                        </span>
                      ) : (
                        <span>
                          <MicOff />
                        </span>
                      )}
                      {localUser && localUser.videoActive ? (
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
                  {this.state.subscribers.map((user, index) => (
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
                <div className="pt-1">
                  <Chat user={localUser} roomID={this.props.roomName}></Chat>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /**
   * --------------------------
   * SERVER-SIDE RESPONSIBILITY
   * --------------------------
   * These methods retrieve the mandatory user token from OpenVidu Server.
   * This behaviour MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
   * the API REST, openvidu-java-client or openvidu-node-client):
   *   1) Initialize a session in OpenVidu Server   (POST /api/sessions)
   *   2) Generate a token in OpenVidu Server      (POST /api/tokens)
   *   3) The token must be consumed in Session.connect() method
   */

  getToken() {
    return this.createSession(this.state.mySessionId).then(sessionId =>
      this.createToken(sessionId)
    )
  }

  createSession(sessionId) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({ customSessionId: sessionId })
      RoomAxios.post(
        this.OPENVIDU_SERVER_URL + '/openvidu/api/sessions',
        data,
        {
          headers: {
            Authorization:
              'Basic ' + btoa('OPENVIDUAPP:' + this.OPENVIDU_SERVER_SECRET),
            'Content-Type': 'application/json',
          },
        }
      )
        .then(response => {
          console.log('CREATE SESION', response)
          resolve(response.data.id)
        })
        .catch(response => {
          var error = Object.assign({}, response)
          if (error.response && error.response.status === 409) {
            resolve(sessionId)
          } else {
            console.log(error)
            console.warn(
              'No connection to OpenVidu Server. This may be a certificate error at ' +
                this.OPENVIDU_SERVER_URL
            )
            if (
              window.confirm(
                'No connection to OpenVidu Server. This may be a certificate error at "' +
                  this.OPENVIDU_SERVER_URL +
                  '"\n\nClick OK to navigate and accept it. ' +
                  'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                  this.OPENVIDU_SERVER_URL +
                  '"'
              )
            ) {
              window.location.assign(
                this.OPENVIDU_SERVER_URL + '/accept-certificate'
              )
            }
          }
        })
    })
  }

  createToken(sessionId) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({})
      RoomAxios.post(
        this.OPENVIDU_SERVER_URL +
          '/openvidu/api/sessions/' +
          sessionId +
          '/connection',
        data,
        {
          headers: {
            Authorization:
              'Basic ' + btoa('OPENVIDUAPP:' + this.OPENVIDU_SERVER_SECRET),
            'Content-Type': 'application/json',
          },
        }
      )
        .then(response => {
          console.log('TOKEN', response)
          resolve(response.data.token)
        })
        .catch(error => reject(error))
    })
  }
}
export default VideoRoom
