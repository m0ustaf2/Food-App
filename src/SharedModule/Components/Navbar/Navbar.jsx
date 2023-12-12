import React from 'react'
import avatar from "../../../assets/images/Moo.jpg";

export default function Navbar({adminData}) {
  // console.log(adminData);
  return (
    <>
   <nav className="navbar navbar-expand-lg bg-nav rounded-2">
  <div className="container-fluid">
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">
          <div className="d-flex justify-content-between align-items-center">
            <div className='img-container mx-1'>
          <img className='w-100 rounded-pill' src={avatar} alt="user-img" />
            </div>
            <p className='text-success text-uppercase'>
            {adminData?.userName}
            </p>
          </div>
          </a>
        </li>
      </ul>
      
    </div>
  </div>
</nav>

    </>
  )
}
