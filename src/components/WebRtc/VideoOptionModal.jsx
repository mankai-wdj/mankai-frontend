import { useTranslation } from 'react-i18next'
import { useState, Fragment, useEffect } from 'react'
import * as React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import MicIcon from '@mui/icons-material/Mic'
function VideoOptionModal(props) {
  const { t } = useTranslation(['lang'])
  const [cameras, setCameras] = useState(null)
  const [mics, setMics] = useState(null)
  const [selectedCamera, setSelectedCamera] = useState(props.selectedCamera)
  const [selectedMic, setSelectedMic] = useState(null)

  async function getDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      setCameras(devices.filter(device => device.kind === 'videoinput'))
      setMics(devices.filter(device => device.kind === 'audioinput'))
    } catch (e) {
      console.log(e)
    }
  }

  const changeCamera = (videoDevice, audioDevice) => {
    props.handleCamera(videoDevice)
    setSelectedCamera(videoDevice)
    console.log('카메라 바뀜')
    props.handleClose()
  }
  useEffect(() => {
    setSelectedCamera(props.selectedCamera)
  }, [props.selectedCamera])

  useEffect(() => {
    console.log('업데이트됨')
  }, [selectedCamera])
  useEffect(() => {
    getDevices()
  }, [])
  return (
    <Transition appear show={props.open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={props.handleClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-3 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl shadow border dark:bg-gray-900">
              <div className="flex justify-end ">
                <button
                  type="button"
                  onClick={props.handleClose}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                  data-modal-toggle="authentication-modal"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className=" mx-auto">
                <div className="font-bold text-xl p-2 oveflow-x-auto">
                  스트리밍 옵션
                </div>
                <div className="flex overflow-x-auto py-3 w-full">
                  <div>
                    <CameraAltIcon />
                  </div>

                  <div class="relative w-full">
                    <select
                      class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-state"
                      onChange={e => {
                        setSelectedCamera(e.target.value)
                      }}
                      key={selectedCamera ? selectedCamera : null}
                      defaultValue={selectedCamera ? selectedCamera : null}
                    >
                      {cameras &&
                        cameras.map((camera, i) => (
                          <option value={camera.deviceId}>
                            {camera.label}
                          </option>
                        ))}
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        class="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex overflow-x-auto py-3 w-full">
                  <div>
                    <MicIcon />
                  </div>

                  <div class="relative w-full">
                    <select
                      class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-state"
                      onChange={e => {
                        setSelectedMic(e.target.value)
                      }}
                    >
                      {mics &&
                        mics.map((mic, i) => (
                          <option value={mic.deviceId}>{mic.label}</option>
                        ))}
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        class="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center py-2">
                <button
                  onClick={() => changeCamera(selectedCamera, selectedMic)}
                  className=" px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  확인
                </button>
                <button
                  type="button"
                  className="ml-2 px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  onClick={props.handleClose}
                >
                  취소
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
export default VideoOptionModal
