import {Sidebar} from 'flowbite-react';
import { useEffect, useState } from 'react';
import {HiUser, HiArrowSmRight} from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOutSuccess } from '../redux/user/userSlice.js';

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab,setTab] = useState('');
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  },[location.search]);

  const handleSignOut = async ()=>{
    try {
      const res = await fetch('/api/user/signout',{
        method: 'POST'
      });
      const data = await res.json();
      if(res.ok){
        dispatch(signOutSuccess());
      }
      else{
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
            <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={'User'} labelColor='dark' onClick={()=>navigate('/dashboard?tab=profile')}>
              Profile
            </Sidebar.Item>
          <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignOut}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
