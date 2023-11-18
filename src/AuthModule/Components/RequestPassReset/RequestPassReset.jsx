import React, { useState } from "react";
import logo from "../../../assets/images/1.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import {useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RequestPassReset() {
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
        console.log(data);
        setIsLoading(true)
        axios.post(`${baseUrl}/api/v1/Users/Reset/Request`,data).then((response)=>{
          console.log(response);
          notify(response.data.message,'success')
          navigate('/reset-pass')
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
                <h2>Request Reset  Password</h2>
                <p className="text-muted">
                Please Enter Your Email And Check Your Inbox
                </p>
                <div className="form-group my-3 position-relative aftr">
                <i className="fa-regular fa-envelope  position-absolute"></i>
                  <input
                    className="form-control ps-4 mb-1"
                    type="email"
                    placeholder="Enter your E-mail"
                    {...register('email',{
                      required:true,
                      pattern:/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/
                    })}
                  />
                  {errors.email&&errors.email.type==="required"&&(<span className="text-danger">email is required</span>)}
                  {errors.email&&errors.email.type==="pattern"&&(<span className="text-danger">invalid email</span>)}
                </div>
                <div className="form-group my-3">
                  <button className="btn btn-success w-100">
                     {isLoading == true ? <i className='fas fa-spinner fa-spin'></i>:'Send'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    
    </>
  )
}
