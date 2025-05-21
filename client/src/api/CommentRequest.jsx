import axios from 'axios'

const API = axios.create({baseURL: "http://localhost:5000"})

export const createComment = (postId,userId,text) => API.post('/comment',postId,userId,text)
export const getComments = (postId)=>API.get(`/comment/${postId}`);