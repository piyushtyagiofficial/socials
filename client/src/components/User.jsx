import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { followUser, unFollowUser } from '../actions/UserAction'
import { Link } from 'react-router-dom'

const User = ({person}) => {
const dispatch = useDispatch()
const {user} = useSelector((state)=>state.authReducer.authData)
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER
  const [following, setFollowing] = useState(person.followers.includes(user._id))
  

  const handleFollow = ()=>{
    following?
    dispatch(unFollowUser(person._id,user)) :
    dispatch(followUser(person._id,user))
    
    setFollowing((prev)=>!prev)
  }
  
  return (
    <div className='follower'>
    <div>

    <Link to = {`/UserProfile/${person._id}`}>
    <img src={person.coverPicture ? serverPublic + person.profilePicture: serverPublic + "defaultProfile.png"} alt="" className="followerImage"/>

    </Link>

    <div className="name">
      <span>{person.firstname} {person.lastname}</span>
      <span>{person.username}</span>
    </div>
  </div>
  <button className={following ? "button fc-button UnfollowButton" : "button fc-button" } onClick={handleFollow}>{following?"Unfollow" :"Follow"}</button>
  </div>
        
  )
}

export default User