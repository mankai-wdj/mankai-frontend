import React, { useEffect, useRef, useState, Component } from 'react'

import { OpenVidu } from 'openvidu-browser'
import axios from 'axios'
import StreamComponent from '../stream/StreamComponent'
import DialogExtensionComponent from '../dialog-extension/DialogExtension'
import './MobileRoom.css'
import OpenViduLayout from '../../layouts/mobile-layout'
import UserModel from '../../models/user-model'
import MobileToolbar from '../toolbar/MobileToolbar'
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
import MiniPeople from './MiniPeople'
var localUser = new UserModel()
const RoomAxios = axios.create()
const SpeechRecognition =
  window.webkitSpeechRecognition || window.SpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = false
mic.lang = 'ko'

class MobileVideoRoom extends Component {
  constructor(props) {
    super(props)
    this.OPENVIDU_SERVER_URL = process.env.REACT_APP_OPENVIDU_SERVER_URL
    this.OPENVIDU_SERVER_SECRET = process.env.REACT_APP_OPENVIDU_SERVER_SECRET
    this.hasBeenUpdated = false
    this.layout = new OpenViduLayout()
    let sessionName = this.props.roomName
    let userName = this.props.user
      ? this.props.user.name
      : 'Mankai' + Math.floor(Math.random() * 100)
    let userInfo = this.props.user
    let country = this.props.user.country
    this.remotes = []
    this.localUserAccessAllowed = false
    this.state = {
      mySessionId: sessionName,
      myUserName: userName,
      session: undefined,
      localUser: undefined,
      openModal: false,
      subscribers: [],
      chatDisplay: 'none',
      userDisplay: 'none',
      userInfo: userInfo,
      currentVideoDevice: undefined,
      sst: undefined,
      chatCount: 0,
    }

    this.joinSession = this.joinSession.bind(this)
    this.leaveSession = this.leaveSession.bind(this)
    this.onbeforeunload = this.onbeforeunload.bind(this)
    this.updateLayout = this.updateLayout.bind(this)
    this.camStatusChanged = this.camStatusChanged.bind(this)

    this.micStatusChanged = this.micStatusChanged.bind(this)
    this.captionTranslate = this.captionTranslate.bind(this)
    this.nicknameChanged = this.nicknameChanged.bind(this)
    this.toggleFullscreen = this.toggleFullscreen.bind(this)
    this.switchCamera = this.switchCamera.bind(this)
    this.screenShare = this.screenShare.bind(this)
    this.stopScreenShare = this.stopScreenShare.bind(this)
    this.closeDialogExtension = this.closeDialogExtension.bind(this)
    this.toggleChat = this.toggleChat.bind(this)
    this.toggleUser = this.toggleUser.bind(this)
    this.checkNotification = this.checkNotification.bind(this)
    this.checkSize = this.checkSize.bind(this)
    this.setOpenModal = this.setOpenModal.bind(this)
    this.closeOpenModal = this.closeOpenModal.bind(this)
    this.getPermissions = this.getPermissions.bind(this)
  }

  componentDidMount() {
    const openViduLayoutOptions = {
      maxRatio: 3 / 4,
      minRatio: 9 / 16,
      fixedRatio: true,
      bigClass: 'OV_big',
      bigPercentage: 0.7,
      bigFixedRatio: true,
      bigMaxRatio: 9 / 16,
      bigMinRatio: 9 / 16,
      bigFirst: true,
      animate: true,
    }
    this.layout.initLayoutContainer(
      document.getElementById('layout'),
      openViduLayoutOptions
    )
    window.addEventListener('beforeunload', this.onbeforeunload)
    window.addEventListener('resize', this.updateLayout)
    window.addEventListener('resize', this.checkSize)
    this.getPermissions()
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
    this.OV.setAdvancedConfiguration({
      interval: 20, // Frequency of the polling of audio streams in ms (default 100)
      threshold: 50, // Threshold volume in dB (default -50)
    })
    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        this.subscribeToStreamCreated()
        this.connectToSession()
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
    let publisher = this.OV.initPublisher(undefined, {
      audioSource: undefined,
      videoSource: videoDevices[0].deviceId,
      publishAudio: localUser.isAudioActive(),
      publishVideo: localUser.isVideoActive(),
      resolution: '1920x1080',
      frameRate: 30,
      insertMode: 'APPEND',
      mirror: false,
    })
    publisher.on('publisherStartSpeaking', event => {
      try {
        mic.start()
      } catch {}
      console.log('로컬 유저')
      localUser.setSpeaking(true)
      this.sendSignalUserChanged({ speaking: true })
    })

    publisher.on('publisherStopSpeaking', event => {
      mic.stop()
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
    }
    mic.onend = () => {}
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

    // Empty all properties...
    this.OV = null
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
      this.updateLayout()
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
      this.layout.updateLayout()
    }, 20)
  }

  setOpenModal = () => {
    this.setState({ openModal: true })
  }
  closeOpenModal = () => {
    this.setState({ openModal: false })
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

  async switchCamera() {
    try {
      const devices = await this.OV.getDevices()
      var videoDevices = devices.filter(device => device.kind === 'videoinput')

      if (videoDevices && videoDevices.length > 1) {
        var newVideoDevice = videoDevices.filter(
          device => device.deviceId !== this.state.currentVideoDevice.deviceId
        )

        if (newVideoDevice.length > 0) {
          // Creating a new publisher with specific videoSource
          // In mobile devices the default and first camera is the front one
          var newPublisher = this.OV.initPublisher(undefined, {
            audioSource: undefined,
            videoSource: newVideoDevice[0].deviceId,
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
            currentVideoDevice: newVideoDevice,
            localUser: localUser,
          })
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
  handleDblClick = e => {
    const layoutDivs = document.querySelectorAll('.custom-class')
    const el = e.target.closest('.custom-class')

    if (el.classList.contains('OV_big')) {
      el.classList.remove('OV_big')
    } else {
      for (let i = 0; i < layoutDivs.length; i++) {
        layoutDivs[i].classList.remove('OV_big')
      }
      el.classList.add('OV_big')
    }

    this.updateLayout()
  }

  screenShare() {
    const videoSource =
      navigator.userAgent.indexOf('chrome') !== -1 ? 'window' : 'screen'
    const publisher = this.OV.initPublisher(
      undefined,
      {
        videoSource: videoSource,
        audioSource: undefined,
        resolution: '1920x1080',
        publishAudio: true,
        insertMode: 'PREPEND',
        publishVideo: localUser.isVideoActive(),
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
      publisher.stream.getMediaStream().getVideoTracks()[0].contentHint =
        'motion' // 스크렌쉐어 낮은 fps 나오는거 문제 해결
      this.state.session.unpublish(localUser.getStreamManager())
      localUser.setStreamManager(publisher)
      this.state.session.publish(localUser.getStreamManager()).then(() => {
        localUser.setScreenShareActive(true)
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
    this.state.session.unpublish(localUser.getStreamManager())
    this.connectWebCam()
  }

  checkSomeoneShareScreen() {
    let isScreenShared
    // return true if at least one passes the test
    isScreenShared =
      this.state.subscribers.some(user => user.isScreenShareActive()) ||
      localUser.isScreenShareActive()
    const openviduLayoutOptions = {
      maxRatio: 3 / 4,
      minRatio: 9 / 16,
      fixedRatio: isScreenShared,
      bigClass: 'OV_big',
      bigPercentage: 0.7,
      bigFixedRatio: false,
      bigMaxRatio: 9 / 16,
      bigMinRatio: 9 / 16,
      bigFirst: true,
      animate: true,
    }
    this.layout.setLayoutOptions(openviduLayoutOptions)
    this.updateLayout()
  }

  toggleChat(property) {
    let display = property

    if (display === undefined) {
      display = this.state.chatDisplay === 'none' ? 'block' : 'none'
    }
    if (display === 'block') {
      this.setState({
        chatDisplay: display,
        messageReceived: false,
        chatCount: 0,
      })
    } else {
      this.setState({ chatDisplay: display })
    }
    this.updateLayout()
  }

  toggleUser(property) {
    let display = property

    if (display === undefined) {
      display = this.state.userDisplay === 'none' ? 'block' : 'none'
    }
    if (display === 'block') {
      this.setState({ userDisplay: display })
    } else {
      this.setState({ userDisplay: display })
    }
    this.updateLayout()
  }
  checkNotification(event) {
    if (this.state.chatDisplay == 'none') {
      this.setState({
        chatCount: (this.state.chatCount += 1),
        messageReceived: this.state.chatDisplay === 'none',
      })
    }
  }
  checkSize() {
    if (
      document.getElementById('layout').offsetWidth <= 700 &&
      !this.hasBeenUpdated
    ) {
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
    var userDisplay = { display: this.state.userDisplay }
    return (
      <>
        <div class="h-[calc(100vh-calc(100vh-100%))] w-full">
          <div class="bg-gray-800 h-screen mx-auto max-w-full">
            <div className="flex w-full h-full">
              <div className="flex flex-col w-full h-full">
                <div>
                  <ChangeNameModal
                    open={this.state.openModal}
                    user={localUser}
                    handleNickname={this.nicknameChanged}
                    handleClose={this.closeOpenModal}
                  />
                  {localUser !== undefined &&
                    localUser.getStreamManager() !== undefined && (
                      <div style={userDisplay}>
                        <MiniPeople
                          Display={this.state.userDisplay}
                          localUser={this.state.localUser}
                          subscribers={this.state.subscribers}
                          handleOpen={this.setOpenModal}
                          close={this.closeOpenModal}
                        />
                      </div>
                    )}
                </div>
                <div id="container" className="flex flex-col h-full w-full">
                  <div
                    id="layout"
                    className="bounds2 "
                    onDoubleClick={this.handleDblClick}
                  >
                    {localUser !== undefined &&
                      localUser.getStreamManager() !== undefined && (
                        <div className="custom-class " id="localUser">
                          <StreamComponent
                            user={localUser}
                            handleNickname={this.nicknameChanged}
                          />
                        </div>
                      )}
                    {this.state.subscribers.map((sub, i) => (
                      <div key={i} className="custom-class" id="remoteUsers">
                        <StreamComponent
                          user={sub}
                          streamId={sub.streamManager.stream.streamId}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    {localUser !== undefined &&
                      localUser.getStreamManager() !== undefined && (
                        <div style={chatDisplay}>
                          <MiniChat
                            user={localUser}
                            chatDisplay={this.state.chatDisplay}
                            messageReceived={this.checkNotification}
                            roomID={this.props.roomName}
                          />
                        </div>
                      )}
                  </div>
                  <MobileToolbar
                    sessionId={mySessionId}
                    user={localUser}
                    showNotification={this.state.messageReceived}
                    chatCount={this.state.chatCount}
                    camStatusChanged={this.camStatusChanged}
                    micStatusChanged={this.micStatusChanged}
                    screenShare={this.screenShare}
                    stopScreenShare={this.stopScreenShare}
                    toggleFullscreen={this.toggleFullscreen}
                    toggleUser={this.toggleUser}
                    switchCamera={this.switchCamera}
                    leaveSession={this.leaveSession}
                    toggleChat={this.toggleChat}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
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
export default MobileVideoRoom
