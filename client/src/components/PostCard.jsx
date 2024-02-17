import React from 'react'
import { Link } from 'react-router-dom'

export default function PostCard({p}) {
  return (
    <div className='group relative w-full border h-[350px] overflow-hidden rounded-lg sm:w-[350px] border-teal-500 hover:border-2'>
        <Link to={`/post/${p.slug}`}>
            <img src={p.image} alt="post cover" className='h-[250px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20' />
        </Link>
        <div className='flex flex-col gap-2 p-3'>
            <p className='text-lg font-semibold line-clamp-3'>{p.title}</p>
            <span className='text-sm italic'>{p.category}</span>
            <Link to={`/post/${p.slug}`} className='z-10 group-hover:bottom-0 absolute bottom-[-50px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-lg m-2'>
                Read Article
            </Link>
        </div>
    </div>
  )
}
