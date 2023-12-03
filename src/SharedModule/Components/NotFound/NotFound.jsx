import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Not found</title>
      </Helmet>
      <div className="nofound">
        <div className="container d-flex  align-items-center vh-100">
          <div className="my-5">
            <h1 className="fs-1 fw-bold  ">Oops.... </h1>
            <p className="fs-1 text-success">Page not found</p>
            <span>
              This Page doesn’t exist or was removed! <br />
              We suggest you back to home.
            </span>
            <div className="my-3">
              <Link to="">
                <button className="btn btn-success">
                  {" "}
                  <i className="fa-solid fa-arrow-left"></i> Back to Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
