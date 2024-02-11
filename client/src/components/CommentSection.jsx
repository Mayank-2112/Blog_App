import { Alert, Button, Textarea } from 'flowbite-react';
import React, { useState } from 'react';
import {useSelector} from 'react-redux';
import { Link } from 'react-router-dom';

export default function CommentSection({postId}) {
    const {currentUser} = useSelector((state)=>state.user);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);
    const handleCommentSubmit = async (e)=>{
        e.preventDefault();
        if (comment.length > 200){
            return;
        }
        try {
            const res = await fetch('/api/comment/create',{
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({content: comment, postId, userId: currentUser._id}),
            });
            const data = await res.json();
            if(res.ok){
                setComment('');
                setCommentError(null);
            }
        }
        catch (error) {
            setCommentError(error.message);
        }
    };
  return (
    <div className='max-w-2xl mx-auto my-5 w-full'>
        {currentUser ?
            (
            <div className='flex gap-1 items-center text-sm text-gray-500'>
                <p>Signed in as:</p>
                <img src={currentUser.profilePicture} alt="" className='w-5 h-5 rounded-full'/>
                <Link to='/dashboard?tab=profile' className='text-cyan-600 text-xs hover:underline'>
                    @{currentUser.username}
                </Link>
            </div>
            ):
            (
            <div className='flex gap-1 items-center text-sm text-gray-500'>
                <span>You must be signed in to comment</span>
                <Link to='/sign-in' className='text-cyan-600 text-xs hover:underline'>Sign In</Link>
            </div>
            )
        }
        {currentUser && (
            <form className='border border-teal-500 p-3 rounded-lg mt-3' onSubmit={handleCommentSubmit}>
                <Textarea placeholder='Add Comment...' rows='3' maxLength='200' onChange={(e)=>{setComment(e.target.value)}} value={comment}/>
                <div className='flex justify-between mt-5 items-center'>
                    <p className='text-grat-500 text-sm'>{200 - comment.length} characaters remaining</p>
                    <Button type='submit' outline gradientDuoTone='purpleToBlue'>Submit</Button>
                </div>
                {commentError && (
                    <Alert color='failure' className='mt-5'>{commentError}</Alert>
                )}
            </form>
        )}
    </div>
  )
}
