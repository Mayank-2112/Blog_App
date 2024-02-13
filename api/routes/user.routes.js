import express from 'express';
import { deleteUser, getUser, getUsers, signOut, test, update } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test',test);
router.post('/signout',signOut);
router.put('/update/:id',verifyToken, update);
router.delete('/delete/:id',verifyToken, deleteUser);
router.get('/getusers',verifyToken, getUsers);
router.get('/:userId', getUser);

export default router;
