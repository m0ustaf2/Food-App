import React, { useState } from "react";
import logo from "../../../assets/images/1.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login({saveAdminData}) {
  const notify = (msg,type) => {
    toast[type](msg);
  }
  const [isLoading,setIsLoading]=useState(false);
  const baseUrl='http://upskilling-egypt.com:3002';
  const navigate=useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = (data) => {
    reset() //to Reset-form
    setIsLoading(true)
    axios.post(`${baseUrl}/api/v1/Users/Login`,data).then((response)=>{
      localStorage.setItem("adminToken",response.data.token)
      saveAdminData();
      notify("Login Success",'success')
      navigate('/dashboard')
      setIsLoading(false)
    }).catch((error)=>{
      notify(error.response.data.message,'error')
      setIsLoading(true)
    })
  };

  return (
    <>
      <div className="Auth-container  container-fluid">
        <div className="row bg-overlay vh-100 justify-content-center align-items-center ">
          <div className="col-md-6">
            <div className="bg-white p-2">
              <div className="logo-cont text-center">
                <img src={logo} className="w-25" alt="logo" />
              </div>
              <form className="w-75 m-auto" onSubmit={handleSubmit(onSubmit)}>
                <h2>Log In</h2>
                <p className="text-muted">
                  Welcome Back! Please enter your details.
                </p>
                <div className="form-group my-3">
                <div className="bgMain rounded-3 w-100 ps-4 d-flex justify-content-center position-relative">
                <i className="fa-solid fa-mobile-screen-button position-absolute"></i>
                  <input
                    className="form-control bgMain"
                    type="email"
                    placeholder="Enter your E-mail"
                    {...register('email',{
                      required:true,
                      pattern:/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/
                    })}
                  />
                </div>
                  {errors.email&&errors.email.type==="required"&&(<span className="text-danger">email is required</span>)}
                  {errors.email&&errors.email.type==="pattern"&&(<span className="text-danger">invalid email</span>)}
                </div>
                <div className="form-group my-3 ">
                <div className="bgMain rounded-3 w-100 ps-4 d-flex justify-content-center position-relative ">
                  <i className="fa-solid fa-lock position-absolute"></i>
                  <input
                    className="form-control bgMain"
                    type="password"
                    placeholder="Password"
                    {...register('password',{
                      required:true
                    })}
                  />
                </div>
                  {errors.password&&errors.password.type==="required"&&(<span className="text-danger">password is required</span>)}
                </div>
                <div className="d-flex justify-content-between">
                 <Link className="text-decoration-none text-black">Register Now?</Link>
                  <Link className="text-decoration-none text-success" to={'/request-pass-reset'} >Forget Password?</Link>
                </div>
                <div className="form-group my-3">
                  <button className="btn btn-success w-100">
                     {isLoading == true ? <i className='fas fa-spinner fa-spin'></i>:'Login'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
