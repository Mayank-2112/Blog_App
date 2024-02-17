import { Alert, Button, Modal, Textarea } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function CommentSection({postId}) {
    const {currentUser} = useSelector((state)=>state.user);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [commentError, setCommentError] = useState(null);
    const navigate = useNavigate();
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
                setComments([data,...comments]);
            }
        }
        catch (error) {
            setCommentError(error.message);
        }
    };

    useEffect(()=>{
        const getComments = async ()=>{
            try {
                const res = await fetch(`/api/comment/getcomments/${postId}`);
                if(res.ok){
                    const data = await res.json();
                    setComments(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        getComments();
    },[postId]);

    const handleLike = async (commentId)=>{
        try {
            if(!currentUser){
                navigate('/sign-in');
                return;
            }
            const res = await fetch(`/api/comment/likecomment/${commentId}`,{
                method: 'POST',
            });
            if (res.ok){
                const data = await res.json();
                setComments(comments.map((comm)=>
                    comm._id === commentId ? {
                        ...comm,
                        likes: data.likes,
                        numberOfLikes: data.likes.length,
                    } : comm
                ))
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    const handleEdit = async (comment, editedContent)=>{
        try {
            setComments(comments.map((c)=>
                c._id === comment._id ? {...c, content : editedContent} : c
            ));
        } catch (error) {
            console.log(error.message);
        }
    };
    const handleDeleteComment = async (commentId)=>{
        setShowModal(false);
        try {
            if(!currentUser){
                navigate('/sign-in');
                return;
            }
            const res = await fetch(`/api/comment/deletecomment/${commentId}`,{
                method: 'DELETE'
            });
            if(res.ok){
                const data = await res.json();
                setComments(comments.filter((com)=>com._id !== commentId));
                
            }
        } catch (error) {
            console.log(error.message);
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
        {comments.length === 0 ? (
            <p className='text-sm my-5'>No Comments Yet!!</p>
        ):(
            <>
                <div className='text-sm my-5 flex items-center gap-1'>
                    <p>Comments</p>
                    <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                        <p>{comments.length}</p>
                    </div>
                </div>
                {comments.map((comm) =>(
                    <Comment key={comm._id} comm={comm} onLike={handleLike} onEdit={handleEdit} onDelete={(commentId)=>{
                        setShowModal(true);
                        setCommentToDelete(commentId);
                    }}/>
                ))}
            </>
        )}
        <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
        <Modal.Header/>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-5 mx-auto'/>
            <h3 className='text-xl mb-5 text-gray-500 dark:text-gray-400'>Are you sure you want to delete this post?</h3>
          </div>
          <div className=' flex gap-5 justify-center'>
            <Button color='failure' onClick={()=>handleDeleteComment(commentToDelete)}>Yes I'm Sure</Button>
            <Button color='gray' onClick={()=>setShowModal(false)}>No, Cancel</Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}


