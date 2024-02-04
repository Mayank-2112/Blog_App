import React, { useEffect, useState } from 'react'
import {useLocation} from 'react-router-dom';
import Profile from '../components/Profile';
import DashSidebar from '../components/DashSidebar';
import Posts from '../components/Posts';
import Users from '../components/Users';

export default function Dashboard() {
  const location = useLocation();
  const [tab,setTab] = useState('');
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  },[location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className=''>
        <DashSidebar/>
      </div>
        { tab === 'profile' &&  <Profile/>}
        { tab === 'users' &&  <Users/>}
        { tab === 'posts' &&  <Posts/>}
    </div>
  )
}
