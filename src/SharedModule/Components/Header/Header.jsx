import React from "react";
import header from "../../../assets/images/home-avatar.svg";

export default function Header({prefix, title, paragraph }) {
  return (
    <>
      <div className="header-content rounded-3   m-2  text-white">
       <div className="container-fluid">
       <div className="row px-4  py-2 g-0 align-items-center">
          <div className="col-md-10">
            <div>
              <h3>{prefix}
                <span className="text-header"> {title}</span> 
                </h3>
              <p>
               {paragraph}
              </p>
            </div>
          </div>
          <div className="col-md-2 text-center">
            <div>
              <img className="w-100" src={header} alt="header" />
            </div>
          </div>
        </div>
       </div>
      </div>
    </>
  );
}
