import express from 'express';
import { createComment, getComments, likeComment } from '../controllers/comment.controller.js';
import {verifyToken} from '../utils/verifyUser.js'
const router = express.Router();

router.post('/create',verifyToken ,createComment);
router.get('/getcomments/:postId', getComments);
router.post('/likecomment/:commentId',verifyToken, likeComment);

export default router;