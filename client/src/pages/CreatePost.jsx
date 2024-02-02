import { Button, FileInput, Select, TextInput } from 'flowbite-react';
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
  return (
    <div className='max-w-3xl mx-auto p-3 min-h-screen'>
        <h1 className='text-center text-3xl font-semibold my-7'>Create a Post</h1>
        <form className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput type='text' placeholder='Title' required id='title' className='flex-1'/>
                <Select>
                    <option value='uncategorized'>Selet a Category</option>
                    <option value='javascript'>Javascript</option>
                    <option value='reactjs'>ReactJs</option>
                    <option value='nextjs'>NextJs</option>
                </Select>
            </div>
            <div className='flex items-center justify-between gap-4 border-4 border-teal-500 border-dotted p-3'>
                <FileInput type='file' accept='image/*'/>
                <Button type='button' size='sm' gradientDuoTone='purpleToBlue' outline>Upload Image</Button>
            </div>
            <ReactQuill theme='snow' className='h-72 mb-12' placeholder='Write Something...' required/>
            <Button gradientDuoTone='purpleToPink' type='submit'>Publish</Button>
        </form>
    </div>
  )
}
