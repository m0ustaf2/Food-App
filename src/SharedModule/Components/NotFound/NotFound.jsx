import React from 'react'
import notfound from '../../../assets/images/Not Found.png'
export default function NotFound() {
  return (
    <>
    <div className='text-center vh-100'>
    <img className='w-100 vh-100' src={notfound} alt="notfound-img" />

    </div>
    </>
  )
}
