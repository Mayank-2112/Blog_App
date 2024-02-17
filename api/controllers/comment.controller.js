import { errorhandler } from "../utils/error.js";
import Comment from '../models/comment.model.js';
import e from "express";
export const createComment = async (req,res,next)=>{
    try {
        const { content, postId, userId} = req.body;
        if(userId !== req.user.id){
            return next(errorhandler(403,'You are not allowed to create this comment!!'));
        }
        const newComment = new Comment({
            content,
            postId,
            userId,
        });
        await newComment.save();
        res.status(200).json(newComment);
        
    } catch (error) {
        next(error);
    }
};

export const getComments = async (req,res,next)=>{
    try {
        const comment = await Comment.find({postId: req.params.postId}).sort({
            createdAt: -1,
        });
        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
};  

export const likeComment = async (req,res,next)=>{
    try {
        const com = await Comment.findById(req.params.commentId);
        if(!com){
            return next(errorhandler,404,'Comment Not Found');
        }
        const userIndx = com.likes.indexOf(req.user.id);
        if(userIndx === -1){
            com.numberOfLikes +=1;
            com.likes.push(req.user.id);
        }
        else{
            com.numberOfLikes -=1;
            com.likes.splice(userIndx, 1);
        }
        await com.save();
        res.status(200).json(com);
    } catch (error) {
        next(error);
    }
};

export const editComment = async (req,res,next)=>{
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorhandler(404,'Comment Not Found'));
        }
        if (comment.userId !== req.user.id && !req.user.isAdmin){
            return next(errorhandler(404,'You are not allowed to edit this comment'));
        }

        const editedComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            {
                content: req.body.content
            },
            {new : true}
        );
        res.status(200).json(editedComment);
    } catch (error) {
        next(error);
    }
};