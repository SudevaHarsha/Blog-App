import express from 'express';
import { verifyAuthority, verifyEditor, verifyToken } from '../utils/verifyUser.js';
import { create, deletepost, getposts, updatepost, approvepost, approveandaccept } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyAuthority, create)
router.get('/getposts', getposts)
router.delete('/deletepost/:postId/:userId', verifyAuthority, deletepost)
router.put('/updatepost/:postId/:userId', verifyAuthority, updatepost)
router.get('/approveposts', verifyToken, approvepost)
router.put('/approve/:postId', verifyEditor, approveandaccept)


export default router;