import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector} from 'react-redux';

export default function UpdatePost() {
    const [file, setFile] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [publishError, setPublishError] = useState(null);
    const [published, setPublished] = useState(false);
    const [formData, setFormData] = useState({});
    const {postId} = useParams();
    const navigate = useNavigate();
    const {currentUser} = useSelector((state)=>state.user);
    useEffect(()=>{
        try {
            const fetchPost = async ()=>{
                const res = await fetch(`/api/post/getposts?postId=${postId}`);
                const data = await res.json();
                if(!res.ok){
                    setPublishError(data.message);
                    return;
                }
                else{
                    setPublishError(null);
                    setFormData(data.posts[0]);
                }
            }
            fetchPost();
        } catch (error) {
            console.log(error.message);
        }
    },[postId]);


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
    };
    const handleSubmitPost = async (e)=>{
        e.preventDefault();
        setPublished(false);
        try {
            const res = await fetch(`/api/post/updatepost/${postId}/${currentUser._id}`,{
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if(res.ok){
                setPublishError(null);
                setPublished(true);
                navigate(`/post/${data.slug}`);
                return;
            }
            else{
                setPublishError(data.message);
                return;
            }
        } catch (error) {
            setPublishError('Something went Wrong');
        }
    }
  return (
    <div className='max-w-3xl mx-auto p-3 min-h-screen'>
        <h1 className='text-center text-3xl font-semibold my-7'>Update a Post</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmitPost}>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput type='text' placeholder='Title' required id='title' className='flex-1' onChange={(e)=>{setFormData({...formData, title: e.target.value})}} value={formData.title}/>
                <Select onChange={(e)=>{setFormData({...formData, category: e.target.value})}} value={formData.category}>
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
            <ReactQuill theme='snow' className='h-72 mb-12' placeholder='Write Something...' required onChange={(value)=>{setFormData({...formData, content: value})}} value={formData.content}/>
            <Button gradientDuoTone='purpleToPink' type='submit' >Update Post</Button>
            {publishError && (<Alert className='mt-5' color='failure'>{publishError}</Alert>)}
            {published && (<Alert className='mt-5' color='success'>Post Updated Successsfully!!</Alert>)}
        </form>
    </div>
  )
}
