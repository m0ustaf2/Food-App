import React, { useState } from "react";
import logo from "../../../assets/images/1.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ResetPass() {
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
        reset,
        getValues
      } = useForm();
      const onSubmit = (data) => {
        console.log(data);
        reset() //to Reset-form
        axios.post(`${baseUrl}/api/v1/Users/Reset`,data).then((response)=>{
          console.log(response);
          notify(response.data.message,'success')
          navigate('/login')
          setIsLoading(false)
        }).catch((error)=>{
          console.log(error.response);
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
                <h2> Reset  Password</h2>
                <p className="text-muted">
                Please Enter Your Otp  or Check Your Inbox
                </p>
                <div className="form-group my-3 ">
                <div className="bgMain rounded-3 w-100 ps-4 d-flex justify-content-center position-relative">
                <i className="fa-regular fa-envelope  position-absolute"></i>
                  <input
                    className="form-control bgMain"
                    type="email"
                    placeholder="Email"
                    {...register('email',{
                      required:true,
                      pattern:/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/
                    })}
                  />
                </div>
                  {errors.email&&errors.email.type==="required"&&(<span className="text-danger">email is required</span>)}
                  {errors.email&&errors.email.type==="pattern"&&(<span className="text-danger">invalid email</span>)}
                </div>
                <div className="form-group my-3">
                <div className="bgMain rounded-3 w-100 ps-4 d-flex justify-content-center position-relative">
                <i className="fa-solid fa-lock position-absolute"></i>
                  <input
                    className="form-control bgMain"
                    type="text"
                    placeholder="OTP"
                    {...register('seed',{
                      required:true,
                    })}
                  />
                </div>
                  {errors.seed&&errors.seed.type==="required"&&(<span className="text-danger">OTP is required</span>)}
                </div>
                <div className="form-group my-3">
                <div className="bgMain rounded-3 w-100 ps-4 d-flex justify-content-center position-relative">
                <i className="fa-solid fa-lock position-absolute"></i>
                  <input
                    className="form-control bgMain"
                    type="password"
                    placeholder="New Password"
                    {...register('password',{
                      required:true
                    })}
                  />
                </div>
                  {errors.password&&errors.password.type==="required"&&(<span className="text-danger">Password is required</span>)}
                </div>
                <div className="form-group my-3">
                <div className="bgMain rounded-3 w-100 ps-4 d-flex justify-content-center position-relative">
                <i className="fa-solid fa-lock position-absolute"></i>
                  <input
                    className="form-control bgMain"
                    type="password"
                    placeholder="Confirm New Password"
                    {...register('confirmPassword',{
                        validate:{
                            checkNewPassConfirmationHandler:(value)=>{
                              const{password}=getValues();
                              return password === value || "confirm new password and new password  doesn't match"
                            }
                          }
                    })}
                  />
                </div>
                  {errors.confirmPassword&&(<span className="text-danger">{errors.confirmPassword?.message}</span>)}
                </div>
                <div className="form-group my-3">
                  <button className="btn btn-success w-100">
                     {isLoading == true ? <i className='fas fa-spinner fa-spin'></i>:'Reset Password'}
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
