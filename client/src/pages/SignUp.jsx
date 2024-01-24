import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex gap-6 p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center'>
        <div className='flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
              <span className='px-3 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Mayank's</span>Blog
          </Link>
          <p className='text-sm mt-5'> 
            This is a demo project. You can SignUp with email or password or with Google.
          </p>
        </div>
        <div className='flex-1'>
          <form className='flex flex-col gap-5'>
            <div>
              <Label value='Your username'/>
              <TextInput type='text' placeholder='Username' id='username'/>
            </div>
            <div>
              <Label value='Your email'/>
              <TextInput type='text' placeholder='Email' id='email'/>
            </div>
            <div>
              <Label value='Your password'/>
              <TextInput type='text' placeholder='Password' id='password'/>
            </div>
            <Button type='submit' gradientDuoTone='purpleToPink'>Sign Up</Button>
          </form>
          <div className='flex gap-2 mt-5'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>SignIn</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
