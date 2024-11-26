import express from 'express';
import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  test,
  updateUser,
  makePublisher,
  getOnlyUsers,
  changeUserRoles,
  createNewUser
} from '../controllers/user.controller.js';
import { verifyAdmin, verifyEditor, verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout); 
router.post('/createnewuser',verifyAdmin, createNewUser); 
router.get('/getusers', verifyToken, getUsers);
router.get('/getonlyusers', verifyToken, getOnlyUsers);
router.get('/:userId', getUser);
router.put('/makepublisher/:userId', verifyEditor, makePublisher);
router.put('/changeuserrole/:userId', verifyAdmin, changeUserRoles);

export default router;
