import axios from 'axios'

const API = axios.create({baseURL: "http://localhost:5000"})

export const getTimelinePost = (id)=>API.get(`/post/${id}/timeline`)
export const likePost = (id,userId)=>API.put(`post/${id}/like`,{userId: userId})
export const userName =(id)=>API.get('/post')