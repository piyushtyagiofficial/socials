import React from 'react'
import LogoSearch from '../components/LogoSearch'
import InfoCard from '../components/InfoCard'
import FollowersCard from '../components/FollowersCard'

const ProfileLeft = () => {
  return (
    <div className='flex flex-col items-center'>
      <LogoSearch />
      <InfoCard />
      <FollowersCard />
    </div>
  )
}

export default ProfileLeft
