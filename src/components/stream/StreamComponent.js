import React, { Component } from 'react'
import './StreamComponent.css'
import OvVideoComponent from './OvVideo'

import MicOff from '@mui/icons-material/MicOff'
import VideocamOff from '@mui/icons-material/VideocamOff'
import VolumeUp from '@mui/icons-material/VolumeUp'
import VolumeOff from '@mui/icons-material/VolumeOff'
import FormControl from '@mui/material/FormControl'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import HighlightOff from '@mui/icons-material/HighlightOff'

export default class StreamComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nickname: this.props.user.getNickname(),
      showForm: false,
      mutedSound: this.props.isMute ? this.props.isMute : false,
      isFormValid: true,
    }
    this.toggleNicknameForm = this.toggleNicknameForm.bind(this)
    this.toggleSound = this.toggleSound.bind(this)
    this.handleCaption = this.handleCaption.bind(this)
  }

  toggleNicknameForm() {
    if (this.props.user.isLocal()) {
      this.setState({ showForm: !this.state.showForm })
    }
  }

  toggleSound() {
    this.setState({ mutedSound: !this.state.mutedSound })
  }

  handleCaption() {
    console.log('하아')
  }
  render() {
    return (
      <div className="OT_widget-container rounded-2xl">
        {this.props.user !== undefined &&
        this.props.user.getStreamManager() !== undefined ? (
          <div className="bg-black h-auto">
            <OvVideoComponent
              user={this.props.user}
              mutedSound={this.state.mutedSound}
            />

            <div className="bottom-0  relative bg-red text-white flex ">
              {this.props.user.type == 'local' ? (
                <>
                  <div className="bottom-[30px] absolute text-center bg-black bg-opacity-50 w-full px-4">
                    {this.props.user.getCaption() &&
                    this.props.user.isAudioActive() ? (
                      <>
                        <div className="font-semibold text-xl">
                          {this.props.user.getCaption()} (자동자막)
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div className="left-3 bg-white flex font-bold bottom-[10px] absolute">
                    <span className=" bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500">
                      {this.props.user.getNickname()}
                    </span>
                    {this.props.user.isSpeaking() == true &&
                    this.props.user.isAudioActive() ? (
                      <div>말하는중</div>
                    ) : null}
                  </div>
                </>
              ) : (
                <>
                  <div className="bottom-[30px] absolute text-center bg-black bg-opacity-50 w-full px-4">
                    {this.props.user.getCaption() &&
                    this.props.user.isAudioActive() ? (
                      <>
                        <div className="font-semibold text-xl">
                          {this.props.user.getCaption()} (자동자막)
                        </div>
                        <div className="font-semibold text-2xl">
                          {this.props.user.getCaptionTranslate()} (자동자막)
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div className="left-3 bg-gray-500 flex font-bold bottom-[10px] absolute">
                    {this.props.user.getNickname()}

                    {this.props.user.isSpeaking() == true &&
                    this.props.user.isAudioActive() ? (
                      <div>말하는중</div>
                    ) : null}
                  </div>
                </>
              )}
              <div className="right-3 absolute  bottom-[10px]">
                {!this.props.user.isVideoActive() ? (
                  <div className="px-1 mt-2 bg-primary">
                    <VideocamOff id="statusCam" />
                  </div>
                ) : null}

                {!this.props.user.isAudioActive() ? (
                  <div className="px-1 mt-2 bg-primary">
                    <MicOff id="statusMic" />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    )
  }
}
