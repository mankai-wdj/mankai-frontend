import React, { useState } from 'react'
import SearchModal from '../header/SearchModal'
import Notifications from '../header/Notifications'
import UserMenu from '../header/UserMenu'
import { useSelector } from 'react-redux'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { IconButton, Skeleton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { indigo } from '@mui/material/colors'
function Header({ sidebarOpen, setSidebarOpen }) {
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const user = useSelector(state => state.Reducers.user)
  const loading = useSelector(state => state.Reducers.user_pending)
  const noti_count = useSelector(state => state.Reducers.noti_count)
  const noti = useSelector(state => state.Reducers.noti)
  const noti_loading = useSelector(state => state.Reducers.noti_pending)
  const isOpen = useSelector(state => state.Reducers.isOpen)
  const location = useLocation()
  const { pathname } = location

  return (
    <header
      className={
        'sticky top-0 bg-white border-b rounded-b-xl border-slate-200 z-30'
      }
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}
            <div class="flex items-center flex-no-shrink text-white mr-6">
              <Link to="/">
                <img src="/img/logo.png"></img>
              </Link>
            </div>

            <div
              class="hidden md:flex flex-col md:flex-row md:ml-auto mt-3 md:mt-0"
              id="navbar-collapse"
            >
              <NavLink
                to="/board"
                className={
                  pathname.includes('/board') || pathname == '/'
                    ? 'p-2 lg:px-4 md:mx-2 text-white rounded bg-indigo-600 font-bold'
                    : 'p-2 lg:px-4 md:mx-2 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-700 transition-colors duration-300'
                }
              >
                <div className="flex items-center">
                  <span>홈</span>
                </div>
              </NavLink>
              <NavLink
                to="/chat"
                className={
                  pathname.includes('chat')
                    ? 'p-2 lg:px-4 md:mx-2 text-white rounded bg-indigo-600 font-bold'
                    : 'p-2 lg:px-4 md:mx-2 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-700 transition-colors duration-300 '
                }
              >
                <div className="flex items-center">
                  <span>채팅</span>
                </div>
              </NavLink>

              <NavLink
                to="/group"
                className={
                  pathname.includes('group')
                    ? 'p-2 lg:px-4 md:mx-2 text-white rounded bg-indigo-600 font-bold'
                    : 'p-2 lg:px-4 md:mx-2 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-700 transition-colors duration-300 '
                }
              >
                <div className="flex items-center">
                  <span>그룹</span>
                </div>
              </NavLink>
            </div>
          </div>

          <div className="flex items-center">
            {/* Header: Right side */}
            {user && !loading ? (
              <IconButton
                onClick={e => {
                  e.stopPropagation()
                  setSearchModalOpen(true)
                }}
                aria-controls="search-modal"
                style={{
                  backgroundColor: indigo[50],
                }}
              >
                <SearchIcon />
              </IconButton>
            ) : loading ? (
              <Skeleton
                animation="wave"
                variant="circular"
                width={40}
                height={40}
              />
            ) : null}
            <SearchModal
              id="search-modal"
              searchId="search"
              modalOpen={searchModalOpen}
              setModalOpen={setSearchModalOpen}
            />
            {/*  notification */}
            {user && !loading ? (
              <Notifications />
            ) : loading ? (
              <Skeleton
                animation="wave"
                variant="circular"
                width={40}
                height={40}
                className="ml-3"
              />
            ) : null}

            {/*  Divider */}
            <hr className="w-px h-6 bg-slate-200 mx-3" />
            {user && !loading ? (
              <UserMenu />
            ) : loading ? (
              <Skeleton
                animation="wave"
                variant="circular"
                width={40}
                height={40}
              />
            ) : null}
            {!user && !loading ? (
              <Link to="/login" className="button">
                <span className="p-1 px-10 font-bold transition-colors duration-700 transform bg-black hover:bg-indigo-400 text-gray-100 text-lg rounded-xl focus:border-4 border-indigo-300">
                  로그인
                </span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
