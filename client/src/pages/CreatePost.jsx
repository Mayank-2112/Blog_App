import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function CreatePost() {
    const [file, setFile] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [formData, setFormData] = useState({});
    const handleUploadImage = async ()=>{
        try {
            if(!file){
                setImageFileUploadError('Please select a file');
                return;
            }
            setImageFileUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage,fileName);
            const uploadTask = uploadBytesResumable(storageRef,file);
            uploadTask.on(
                'state_changed',
                (snapshot)=>{
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
                    setImageFileUploadProgress(progress.toFixed(0));
                },
                (error)=>{
                  setImageFileUploadError('Image upload failed');
                  setImageFileUploadProgress(null);
                },
                ()=>{
                  getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
                    setImageFileUploadError(null);
                    setImageFileUploadProgress(null);
                    setFormData({...formData, image: downloadUrl});
                  });
                },
              );
        } catch (error) {
            setImageFileUploadError('Image upload failed');
            setImageFileUploadProgress(null);
            console.log(error);
        }
    }
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
                <FileInput type='file' accept='image/*' onChange={(e)=>{setFile(e.target.files[0])}}/>
                <Button type='button' size='sm' gradientDuoTone='purpleToBlue' outline onClick={handleUploadImage} disabled={imageFileUploadProgress}>
                {imageFileUploadProgress ? (
                    <div className='w-16 h-16'>
                        <CircularProgressbar value={imageFileUploadProgress} text={`${imageFileUploadProgress || 0}%`}/>
                    </div>
                ): 'Upload Image'
                }
                </Button>
            </div>
            {imageFileUploadError && (<Alert color='failure'>{imageFileUploadError}</Alert>)}
            {
                formData.image && (
                    <img src={formData.image} alt="image" className='w-full h-72 object-cover'/>
                )
            }
            <ReactQuill theme='snow' className='h-72 mb-12' placeholder='Write Something...' required/>
            <Button gradientDuoTone='purpleToPink' type='submit'>Publish</Button>
        </form>
    </div>
  )
}
