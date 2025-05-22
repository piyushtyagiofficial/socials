import express from 'express';
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUserById,
  followUser,
  unfollowUser,
  searchUsers,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/search', protect, searchUsers);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route('/:id')
  .get(protect, getUserById);
router.put('/:id/follow', protect, followUser);
router.put('/:id/unfollow', protect, unfollowUser);

export default router;