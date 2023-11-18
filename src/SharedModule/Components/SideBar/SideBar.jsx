import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import logo from "../../../assets/images/3.png";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ForgetPass from '../../../AuthModule/Components/ChangePass/ChangePass';
import ChangePass from '../../../AuthModule/Components/ChangePass/ChangePass';

export default function SideBar() {
  let [isCollapsed, setIsCollapsed] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let handleToggle=()=>{
    setIsCollapsed(!isCollapsed)
  }
  let navigate=useNavigate();
  let logOut=()=>{
    localStorage.removeItem("adminToken");
    navigate('/login')
  }
  return (
    <>
   <div className='sidebar-container'>
      <Modal show={show} onHide={handleClose}>
        
        <Modal.Body>
          <ChangePass handleClose={handleClose}/>
        </Modal.Body>
        
      </Modal>
   <Sidebar collapsed={isCollapsed}>
  <Menu>
    <div onClick={handleToggle}>
    <img className='w-75' src={logo} alt='logo'/>
    </div>
  <MenuItem icon={<i className="fa fa-home" aria-hidden="true"></i>} component={<Link to="/dashboard" />}>Home</MenuItem>
    <MenuItem icon={<i className="fa fa-users" aria-hidden="true"></i>} component={<Link to="/dashboard/users" />}> Users</MenuItem>
    <MenuItem icon={<i className="fa fa-rectangle-list" aria-hidden="true"></i>} component={<Link to="/dashboard/recipes" />}> Recipes</MenuItem>
    <MenuItem icon={<i className="fa fa-calendar-days" aria-hidden="true"></i>} component={<Link to="/dashboard/categories" />}> Categories</MenuItem>
    <MenuItem icon={<i className="fa fa-lock" aria-hidden="true"></i>} onClick={handleShow}>Change Password</MenuItem>
    <MenuItem icon={<i className="fa fa-right-from-bracket" aria-hidden="true"></i>} onClick={logOut}>Logout</MenuItem>
  </Menu>
</Sidebar>
   </div>
    
    </>
  )
}
