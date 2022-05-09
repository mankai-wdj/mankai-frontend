class UserModel {
  connectionId
  audioActive
  videoActive
  screenShareActive
  nickname
  streamManager
  user
  userOBJ
  speaking
  caption
  captionOn
  captionTranslate
  screenStreamManager
  type // 'remote' | 'local'

  constructor() {
    this.connectionId = ''
    this.audioActive = true
    this.videoActive = true
    this.screenShareActive = false
    this.nickname = ''
    this.streamManager = null
    this.screenStreamManager = null
    this.type = 'local'
    this.user = 'null'
    this.userOBJ = null
    this.speaking = false
    this.caption = undefined
    this.captionTranslate = undefined
    this.captionOn = false
  }

  isAudioActive() {
    return this.audioActive
  }

  isVideoActive() {
    return this.videoActive
  }

  isScreenShareActive() {
    return this.screenShareActive
  }

  getConnectionId() {
    return this.connectionId
  }

  getNickname() {
    return this.nickname
  }

  getStreamManager() {
    return this.streamManager
  }
  getScreenStreamManager() {
    return this.screenStreamManager
  }
  getUserOBJ() {
    return this.userOBJ
  }
  getCaptionOnOff() {
    return this.captionOn
  }
  getCaption() {
    return this.caption
  }
  getCaptionTranslate() {
    return this.captionTranslate
  }
  isSpeaking() {
    return this.speaking
  }
  isLocal() {
    return this.type === 'local'
  }
  isRemote() {
    return !this.isLocal()
  }
  setAudioActive(isAudioActive) {
    this.audioActive = isAudioActive
  }
  setVideoActive(isVideoActive) {
    this.videoActive = isVideoActive
  }
  setScreenShareActive(isScreenShareActive) {
    this.screenShareActive = isScreenShareActive
  }
  setStreamManager(streamManager) {
    this.streamManager = streamManager
  }
  setScreenStreamManager(streamManager) {
    this.screenStreamManager = streamManager
  }
  setConnectionId(conecctionId) {
    this.connectionId = conecctionId
  }
  setNickname(nickname) {
    this.nickname = nickname
  }
  setUserOBJ(user) {
    this.userOBJ = user
  }
  setType(type) {
    if ((type === 'local') | (type === 'remote')) {
      this.type = type
    }
  }
  setSpeaking(value) {
    this.speaking = value
  }

  setCaption(value) {
    this.caption = value
  }

  captionOnOff(value) {
    this.captionOn = value
  }

  setCaptionTranslate(value) {
    this.captionTranslate = value
  }
}

export default UserModel
