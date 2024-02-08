import { Button } from 'flowbite-react'
import React from 'react'

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        <div className='flex-1 flex flex-col justify-center max-w-xl'>
            <h1 className='text-2xl'>Want to learn more about NextJs ?</h1>
            <p className='text-slate-500 my-2'>Checkout the official documentation for the same. </p>
            <Button gradientDuoTone='purpleToPink' pill>
                <a href="https://nextjs.org/docs/app/building-your-application/routing" target='_blank' rel='noopener noreferrer'>Learn More...</a>
            </Button>
        </div>
        <div className='p-7 flex-1'>
            <img src="https://miro.medium.com/v2/resize:fit:1000/1*v3XndYeIsBtk4CkpMf7vmA.jpeg" alt="" />
        </div>
    </div>
  )
}
