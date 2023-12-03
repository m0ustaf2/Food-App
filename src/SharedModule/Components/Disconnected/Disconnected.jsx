import React from 'react'
import { FaBan } from 'react-icons/fa6'

export default function Disconnected() {
  return (
    <>
    <div className="offline">
    <div className="text-center text-danger d-flex justify-content-center align-items-center alert alert-warning">
    <FaBan />  Your connection is not stable..
    </div>
    </div>
    </>
  )
}
