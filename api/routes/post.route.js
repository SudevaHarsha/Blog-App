import express from 'express';
import { verifyEditor, verifyToken } from '../utils/verifyUser.js';
import { create, deletepost, getposts, updatepost, approvepost, approveandaccept } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getposts', getposts)
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost)
router.put('/updatepost/:postId/:userId', verifyToken, updatepost)
router.get('/approveposts', verifyToken, approvepost)
router.put('/approve/:postId', verifyEditor, approveandaccept)


export default router;