import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Post from './Post'
import { useParams } from 'react-router-dom'
import { getTimelinePost } from '../actions/PostAction'

const Posts = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.authReducer.authData)
  let { posts, loading } = useSelector((state) => state.postReducer)
  const params = useParams()

  useEffect(() => {
    dispatch(getTimelinePost(user._id))
  }, [dispatch, user._id])

  if (!posts) return "No Posts"

  if (params.id) posts = posts.filter((post) => post.userId === params.id)

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        "Fetching Posts..."
      ) : (
        posts.map((post, id) => <Post data={post} key={id} />)
      )}
    </div>
  )
}

export default Posts
