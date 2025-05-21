import axios from 'axios'

const API = axios.create({baseURL: "http://localhost:5000"})


export const userChats= (id)=>API.get(`/chat/${id}`);

export const createChat = (members) => {

    return API.post('/chat',  members );
  };
  
export const findChat = (firstId, secondId) => {
    return API.get(`/chat/find/${firstId}/${secondId}`);
  };