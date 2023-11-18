import React, { useState } from "react";
import logo from "../../../assets/images/1.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export default function ForgetPass({handleClose}) {
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
    axios.put(`${baseUrl}/api/v1/Users/ChangePassword`,data,{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("adminToken")}`
      }
    }).then((response)=>{
      console.log(response);
      handleClose()
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
     <div className="row  justify-content-center align-items-center ">
          <div className="col-md-12">
            <div className="bg-white p-2">
              <div className="logo-cont text-center">
                <img src={logo} className="w-25" alt="logo" />
              </div>
              <form className="w-75 m-auto" onSubmit={handleSubmit(onSubmit)}>
                <h2>Change Your Password</h2>
                <p className="text-muted">
                   Enter your details below
                </p>
                <div className="form-group my-3 position-relative ">
                <i className="fa-solid fa-lock position-absolute"></i>
                  <input
                    className="form-control ps-4 mb-1"
                    type="password"
                    placeholder="Old Password"
                    {...register('oldPassword',{
                      required:true
                    })}
                  />
                  {errors.oldPassword&&errors.oldPassword.type==="required"&&(<span className="text-danger">Old password is required</span>)}
                </div>
                <div className="form-group my-3 position-relative">
                <i className="fa-solid fa-lock position-absolute"></i>
                  <input
                    className="form-control ps-4 mb-1"
                    type="password"
                    placeholder="New Password"
                    {...register('newPassword',{
                      required:true
                    })}
                  />
                  {errors.newPassword&&errors.newPassword.type==="required"&&(<span className="text-danger">New password is required</span>)}
                </div>
                <div className="form-group my-3 position-relative  ">
                <i className="fa-solid fa-lock position-absolute"></i>
                  <input
                    className="form-control ps-4 mb-1"
                    type="password"
                    placeholder="Confirm New Password"
                    {...register('confirmNewPassword',{
                      validate:{
                        checkNewPassConfirmationHandler:(value)=>{
                          const{newPassword}=getValues();
                          return newPassword === value || "new password and confirm new password doesn't match"
                        }
                      }
                    },
                    )}
                  />
                  {errors.confirmNewPassword&&(<span className="text-danger">{errors.confirmNewPassword?.message}</span>)}
                </div>
                <div className="form-group my-3">
                  <button className="btn btn-success w-100">
                     {isLoading == true ? <i className='fas fa-spinner fa-spin'></i>:'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
    </>
  );
}
