import express from 'express';
import { verifyAuthority, verifyToken } from '../utils/verifyUser.js';
import {
  createComment,
  deleteComment,
  editComment,
  getPostComments,
  getcomments,
  likeComment,
} from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createComment);
router.get('/getPostComments/:postId', getPostComments);
router.put('/likeComment/:commentId', verifyToken, likeComment);
router.put('/editComment/:commentId', verifyAuthority, editComment);
router.delete('/deleteComment/:commentId', verifyAuthority, deleteComment);
router.get('/getcomments', verifyToken, getcomments);

export default router;
