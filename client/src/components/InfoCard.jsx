import React, { useEffect, useState } from 'react'
import { UilPen } from '@iconscout/react-unicons'
import ProfileModal from '../components/ProfileModal'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import * as UserApi from '../api/UserRequest'
import { logOut } from '../actions/AuthAction'

const InfoCard = () => {
  const [modalOpened, setModalOpened] = useState(false)
  const dispatch = useDispatch()
  const params = useParams()
  const profileUserId = params.id
  const [profileUser, setProfileUser] = useState(null)
  const { user } = useSelector((state) => state.authReducer.authData)

  useEffect(() => {
    const fetchProfileUser = async () => {
      if (user && profileUserId === user._id) {
        setProfileUser(user)
      } else {
        const profileUser = await UserApi.getUser(profileUserId)
        setProfileUser(profileUser)
      }
    }
    if (profileUserId) {
      fetchProfileUser()
    }
  }, [profileUserId, user])

  const handleLogout = () => {
    dispatch(logOut())
  }

  return (
    <div className="flex flex-col gap-6 bg-[var(--cardColor)] p-4 rounded-xl w-[90%]">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">Profile Info</h4>
        {user && user._id === profileUserId && (
          <div className="hover:cursor-pointer">
            <UilPen width="2rem" height="1.2rem" onClick={() => setModalOpened(true)} />
            <ProfileModal modalOpened={modalOpened} setModalOpened={setModalOpened} data={user} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="font-bold">Status </span>
        <span>{profileUser?.relationShip || ''}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-bold">Lives in </span>
        <span>{profileUser?.livesin || ''}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-bold">Works At </span>
        <span>{profileUser?.worksAt || ''}</span>
      </div>

      <button
        className="button mt-20 ml-32 w-28 h-8 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  )
}

export default InfoCard
