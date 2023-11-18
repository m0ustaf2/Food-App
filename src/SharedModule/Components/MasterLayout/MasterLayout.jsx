import React from "react";
import SideBar from "./../SideBar/SideBar";
import { Outlet } from "react-router-dom";
import Navbar from "./../Navbar/Navbar";
import Header from "./../Header/Header";
import header from "../../../assets/images/eating.png";

export default function MasterLayout({ adminData }) {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <div className="row">
              <div className="col-md-2 side-bg">
                <SideBar />
              </div>
              <div className="col-md-10 bg-transparent"></div>
            </div>
          </div>
          <div className="col-md-10">
            <div>
              <Navbar adminData={adminData} />
              <Header>
                <div className="bg-success rounded-2 my-3 h-25 px-2">
                  <div className="row align-items-center">
                    <div className="col-md-10">
                      <div>
                        <h3>Receipes Items</h3>
                        <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Nobis vel accusamus eaque doloremque deleniti
                          nulla recusandae dolorem necessitatibus quae officia
                          quod nemo aut dolor tempora, deserunt voluptatem
                          reiciendis similique sed consequatur quibusdam porro
                          et. Nemo impedit sapiente illo praesentium recusandae.
                        </p>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div>
                        <img className="w-100" src={header} alt="header" />
                      </div>
                    </div>
                  </div>
                </div>
              </Header>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
