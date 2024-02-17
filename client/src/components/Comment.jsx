import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';

export default function Comment({comm, onLike, onEdit, onDelete}) {
    const [user, setUser] =useState({});
    const [editedContent, setEditedContent] = useState(comm.content);
    const [editing, setEditing] =useState(false);
    const { currentUser} = useSelector((state)=>state.user);
    useEffect(()=>{
        const getUser = async ()=>{
            try {
                const res = await fetch(`/api/user/${comm.userId}`);
                const data = await res.json()
                if(res.ok){
                    setUser(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        getUser();
    },[comm]);

    const handleEdit = async ()=>{
        setEditing(true);
        setEditedContent(comm.content);
    }
    const handleSave = async ()=>{
        try {
            const res = await fetch(`/api/comment/editcomment/${comm._id}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({content: editedContent})
            });
            if (res.ok){
                setEditing(false);
                onEdit(comm, editedContent)
            }
        } catch (error) {
            
        }
    };
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
        <div className='flex-shrink-0 mr-3'>
            <img className='w-10 h-10 rounded-full' src={user.profilePicture} alt={user.username} />
        </div>
        <div className='flex-1'>
            <div className='flex items-center mb-1'>
                <span className='font-bold mr-1 text-sm truncate'>{user ? `@${user.username}` : 'anonymous user'}</span>
                <span className='text-xs text-gray-500'>{moment(comm.createdAt).fromNow()}</span>
            </div>
            {
                editing ? (
                    <>
                        <Textarea value={editedContent} onChange={(e)=>setEditedContent(e.target.value)}/>
                        <div className='flex justify-end gap-2 text-xs mt-2'>
                            <Button type='button' size='sm' gradientDuoTone='purpleToBlue' onClick={handleSave}>Save</Button>
                            <Button type='button' size='sm' gradientDuoTone='purpleToBlue' outline onClick={()=>setEditing(false)}>Cancel</Button>
                        </div>
                    </>

                ):(
                    <>
                        <p className='pb-2 text-gray-500'>{comm.content}</p>
                        <div className='flex items-center gap-2 pt-2 text-xs border-t dark:border-gray-700 max-w-fit '>
                            <button type='button' className={`text-gray-400 hover:text-blue-500 ${currentUser && comm.likes.includes(currentUser._id) && '!text-blue-500'}`} onClick={()=>onLike(comm._id)}>
                                <FaThumbsUp className='text-sm'/>
                            </button>
                            <p className='text-gray-400'>
                                {comm.numberOfLikes > 0 && comm.numberOfLikes + " " + (comm.numberOfLikes === 1 ? 'like' : 'likes')}
                            </p>
                            {
                                currentUser && (currentUser._id === comm.userId || currentUser.isAdmin) && (
                                    <>
                                    <button type='button' className='text-gray-400 hover:text-blue-400' onClick={handleEdit}>Edit</button>
                                    <button type='button' className='text-gray-400 hover:text-red-400' onClick={()=> onDelete(comm._id)}>Delete</button>
                                    </>
                                )
                            }
                        </div>
                    </>
                )
                }
                
        </div>
    </div>
  )
}
