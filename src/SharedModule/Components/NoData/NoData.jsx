import React from 'react'
import noData from '../../../assets/images/nodata.png'

export default function NoData() {
  return (
    <>
    <div className="text-center">
            <img className="w-25"  src={noData} alt="avatar" />
            <h4>No Data Found !</h4>
            {/* <span className="text-muted">are you sure you want to delete this item ? if you are sure just click on delete it</span> */}
            </div>
    </>
  )
}
