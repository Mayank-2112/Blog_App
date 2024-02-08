import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function PostPage() {
    const {postSlug} = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);
    useEffect(()=>{
        const fetchPosts = async ()=>{
            try {
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
                const data = await res.json();
                if(!res.ok){
                    setError(true);
                    setLoading(false);
                    return;
                }
                else{
                    setPost(data.posts[0]);
                    setError(false);
                    setLoading(false);
                }
            } catch ( error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchPosts();
    },[postSlug]);
    if (loading) return (
    <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
    </div>)
  return (
    <main className='flex flex-col p-3 max-w-6xl mx-auto min-h-screen'>
        <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>
        <Link className='self-center mt-10' to={`/search?category=${post && post.category}`}>
        <Button color='gray' pill>{post && post.category}</Button>
        </Link>
        <img src={post && post.image} alt="post image" className='mt-10 mx-auto max-h-[600px] object-cover w-full p-3' />
        <div className='flex justify-between mt-5 border-b border-slate-500 p-3 text-xs '>
            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
            <span className='italic'>{post && (post.content.length/1000).toFixed(0)} mins read</span>
        </div>
        <div dangerouslySetInnerHTML={{__html: post && post.content}} className='p-3 mx-auto w-full post-content'>
        </div>
    </main>
  )
}
