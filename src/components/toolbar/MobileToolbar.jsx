import React, { Component } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'

import Mic from '@mui/icons-material/Mic'
import MicOff from '@mui/icons-material/MicOff'
import Videocam from '@mui/icons-material/Videocam'
import VideocamOff from '@mui/icons-material/VideocamOff'
import Fullscreen from '@mui/icons-material/Fullscreen'
import FullscreenExit from '@mui/icons-material/FullscreenExit'
import SwitchVideoIcon from '@mui/icons-material/SwitchVideo'
import PictureInPicture from '@mui/icons-material/PictureInPicture'
import ScreenShare from '@mui/icons-material/ScreenShare'
import StopScreenShare from '@mui/icons-material/StopScreenShare'
import Tooltip from '@mui/material/Tooltip'
import PowerSettingsNew from '@mui/icons-material/PowerSettingsNew'
import QuestionAnswer from '@mui/icons-material/QuestionAnswer'

import IconButton from '@mui/material/IconButton'
import Header from '../../admin/layout/Header'
import {
  MessageOutlined,
  SupervisedUserCircleOutlined,
  VerifiedUserOutlined,
} from '@mui/icons-material'

export default class MobileToolbar extends Component {
  constructor(props) {
    super(props)
    this.state = { fullscreen: false }
    this.camStatusChanged = this.camStatusChanged.bind(this)
    this.micStatusChanged = this.micStatusChanged.bind(this)
    this.screenShare = this.screenShare.bind(this)
    this.stopScreenShare = this.stopScreenShare.bind(this)
    this.toggleFullscreen = this.toggleFullscreen.bind(this)
    this.switchCamera = this.switchCamera.bind(this)
    this.leaveSession = this.leaveSession.bind(this)
    this.toggleChat = this.toggleChat.bind(this)
    this.userWindow = this.userWindow.bind(this)
  }

  micStatusChanged() {
    this.props.micStatusChanged()
  }

  camStatusChanged() {
    this.props.camStatusChanged()
  }

  screenShare() {
    this.props.screenShare()
  }

  stopScreenShare() {
    this.props.stopScreenShare()
  }

  toggleFullscreen() {
    this.setState({ fullscreen: !this.state.fullscreen })
    this.props.toggleFullscreen()
  }

  switchCamera() {
    this.props.switchCamera()
  }

  leaveSession() {
    this.props.leaveSession()
  }

  toggleChat() {
    this.props.toggleChat()
  }
  userWindow() {
    this.props.toggleUser()
  }
  render() {
    const mySessionId = this.props.sessionId
    const localUser = this.props.user
    return (
      <>
        <div className="bg-white flex items-center justify-center">
          <IconButton
            color="inherit"
            className="navButton"
            onClick={this.userWindow}
          >
            <SupervisedUserCircleOutlined />
          </IconButton>
          <IconButton
            color="inherit"
            className="navButton"
            id="navMicButton"
            onClick={this.micStatusChanged}
          >
            {localUser !== undefined && localUser.isAudioActive() ? (
              <Mic />
            ) : (
              <MicOff color="secondary" />
            )}
          </IconButton>

          <IconButton
            color="inherit"
            className="navButton"
            id="navCamButton"
            onClick={this.camStatusChanged}
          >
            {localUser !== undefined && localUser.isVideoActive() ? (
              <Videocam />
            ) : (
              <VideocamOff color="secondary" />
            )}
          </IconButton>

          <IconButton
            color="inherit"
            className="navButton"
            onClick={this.switchCamera}
          >
            <SwitchVideoIcon />
          </IconButton>
          <IconButton color="inherit" onClick={this.toggleChat}>
            <MessageOutlined />
            {this.props.showNotification && <div id="point" className="" />}
            {this.props.chatCount}
          </IconButton>
        </div>
      </>
    )
  }
}
