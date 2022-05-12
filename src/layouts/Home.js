import { Grid } from '@mui/material'
import { useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from '../admin/layout/Sidebar'
import Header from '../admin/layout/Header'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import Echo from 'laravel-echo'
import BoardCopy from '../components/BoardCopy'
function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [message, SetMessage] = useState([])

  return (
    <>
      <BoardCopy />
    </>
  )
}

export default Home
