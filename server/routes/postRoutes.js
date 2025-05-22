import express from 'express';
import {
  createPost,
  getFeedPosts,
  getUserPosts,
  getPostById,
  deletePost,
  likePost,
  commentOnPost,
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createPost);
router.get('/feed', protect, getFeedPosts);
router.get('/user/:userId', protect, getUserPosts);
router.route('/:id')
  .get(protect, getPostById)
  .delete(protect, deletePost);
router.put('/:id/like', protect, likePost);
router.post('/:id/comments', protect, commentOnPost);

export default router;