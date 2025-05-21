import React, { useEffect, useState } from 'react'
import User from './User'
import { useSelector } from 'react-redux'
import { getAllUser } from '../api/UserRequest'

const FollowersCard = () => {
  const [persons, setPersons] = useState([])

  const { user } = useSelector((state) => state.authReducer.authData)

  useEffect(() => {
    const fetchPersons = async () => {
      const { data } = await getAllUser()
      setPersons(data)
    }
    fetchPersons()
  }, [])

  return (
    <div className="w-full rounded-lg gap-4 flex flex-col text-sm max-h-40 overflow-y-auto bg-[var(--cardColor)] p-4">
      <h3 className="text-base font-semibold">People you may know</h3>
      {persons
        .filter((person) => person._id !== user._id)
        .map((person, id) => (
          <User person={person} key={id} />
        ))}
    </div>
  )
}

export default FollowersCard
