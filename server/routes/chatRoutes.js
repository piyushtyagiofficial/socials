import express from 'express';
import {
  getUserChats,
  createOrGetChat,
  getChatById,
  sendMessage,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getUserChats)
  .post(protect, createOrGetChat);
router.route('/:id')
  .get(protect, getChatById);
router.post('/:id/messages', protect, sendMessage);

export default router;