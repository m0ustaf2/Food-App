import React from 'react'
import avatar from "../../../assets/images/Ellipse 235.png";

export default function Navbar({adminData}) {
  console.log(adminData);
  return (
    <>
   <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">
          <div className="d-flex justify-content-between">
          <img className='w-25' src={avatar} alt="user-img" />
            {adminData.userName}
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
