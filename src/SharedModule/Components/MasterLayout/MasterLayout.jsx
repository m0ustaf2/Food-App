import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./../Navbar/Navbar";
import SideBar from "./../SideBar/SideBar";

export default function MasterLayout({ adminData }) {
  return (
    <>
      <div className="container-fluid">
        <div className="d-flex">
          <div className="row">
            <div className="col-md-2 vh-100 side-bg">
              <SideBar />
            </div>
            <div className="col-md-10 bg-transparent"></div>
          </div>
          <div className="w-100">
            <Navbar adminData={adminData} />
            <div className="container-fluid">
            <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
