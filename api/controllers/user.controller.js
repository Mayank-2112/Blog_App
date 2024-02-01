import User from "../models/user.model.js";
import { errorhandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const test = (req,res)=>{
    res.json({message: 'API is working'});
};

export const update = async (req,res,next)=>{
    if(req.user.id !== req.params.id){
        return next(errorhandler(403,'You are not allowed to update this user'))
    }
    if(req.body.password){
        if(req.body.password.length < 6){
            return next(errorhandler(400,'Password must be atleast 6 characters'));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    };
    if(req.body.username){
        if(req.body.username.length < 7 || req.body.username.length > 20){
            return next(errorhandler(400,'Username must be between 7 and 20 characters'));
        }
        if(req.body.username.includes(' ')){
            return next(errorhandler(400, 'Username cannot have spaces'));
        }
        if(req.body.username !== req.body.username.toLowerCase()){
            return next(errorhandler(400, 'Username must be lowercase'));
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorhandler(400, 'Username can only contain letters and numbers'));
        }
    }
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id,{
            $set: {
                username : req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture,
            },
        },{new: true});
        const {password, ...rest} = updateUser._doc;
        res.status(200).json(rest);
    } 
    catch (error) {
        next(error);
    }
};
    
export const deleteUser = async (req,res,next)=>{
    if(req.user.id !== req.params.id){
        return next(errorhandler(403,'You are not allowed to delete the user'));
    }
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
}