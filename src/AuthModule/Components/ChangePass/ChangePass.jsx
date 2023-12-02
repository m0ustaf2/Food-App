import React, { useState } from "react";
import logo from "../../../assets/images/1.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
export default function ForgetPass({handleClose}) {
  
  const [isLoading,setIsLoading]=useState(false);
  const [showPass,setShowPass]=useState(false);
  const [passType,setPassType]=useState('password');

  const baseUrl='https://upskilling-egypt.com:443';
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
      toast.success(response.data.message)
      // navigate('/login') 
      setIsLoading(false)
    }).catch((error)=>{
      console.log(error.response);
      toast.error(error.response.data.message)
      setIsLoading(false)
    })
  };

  useEffect(() => {
    if(showPass){
      setPassType('text');
      return; 
    }
    setPassType('password');
  }, [showPass])
  
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
                <div className="form-group my-3 position-relative">
                <i className="fa-solid fa-lock position-absolute"></i>
                  <input
                    className="form-control bgMain ps-4"
                    type="password"
                    placeholder="Old Password"
                    {...register('oldPassword',{
                      required:true,
                      pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{6,}$/,
                    })}
                  />
                  {errors.oldPassword&&errors.oldPassword.type==="required"&&(<span className="text-danger">Old password is required!!</span>)}
                  {errors.oldPassword && errors.oldPassword.type === "pattern" && (
                    <span className="text-danger">
                      The password must include at least one lowercase letter,
                      one uppercase letter, one digit, one special character,
                      and be at least 6 characters long!!
                    </span>
                  )}
                </div>
                <div className="form-group my-3 position-relative">
                <i className="fa-solid fa-lock position-absolute"></i>
                  <input
                    className="form-control bgMain ps-4"
                    type={passType}
                    placeholder="New Password"
                    {...register('newPassword',{
                      required:true,
                      pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{6,}$/,
                    })}
                  />
                  {errors.newPassword&&errors.newPassword.type==="required"&&(<span className="text-danger">New password is required!!</span>)}
                  {errors.newPassword && errors.newPassword.type === "pattern" && (
                    <span className="text-danger">
                      The password must include at least one lowercase letter,
                      one uppercase letter, one digit, one special character,
                      and be at least 6 characters long!!
                    </span>
                  )}
                </div>
                <div className="form-group my-3 position-relative">
                <i className="fa-solid fa-lock position-absolute"></i>
                  <input
                    className="form-control bgMain ps-4"
                    type={passType}
                    placeholder="Confirm New Password"
                    {...register('confirmNewPassword',{
                      required:true,
                      pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{6,}$/,
                      validate:{
                        checkNewPassConfirmationHandler:(value)=>{
                          const{newPassword}=getValues();
                          return newPassword === value || "Newpassword and ConfirmNewPassword doesn't match!!"
                        }
                      }
                    },
                    )}
                  />
                  {errors.confirmNewPassword&&(<span className="text-danger">{errors.confirmNewPassword?.message}</span>)}
                  {errors.confirmNewPassword&&errors.confirmNewPassword.type==="required"&&(<span className="text-danger">ConfirmNewPassword is required!!</span>)}
                  {errors.confirmNewPassword && errors.confirmNewPassword.type === "pattern" && (
                    <span className="text-danger">
                      The password must include at least one lowercase letter,
                      one uppercase letter, one digit, one special character,
                      and be at least 6 characters long!!
                    </span>
                  )}
                </div>

                <div className="form-group my-2">
                      <input className="mx-1" type="checkbox" name="passType" checked={showPass} 
                      onChange={(e)=>{
                        console.log(showPass);
                        setShowPass((prev)=>!prev); 
                      }}
                      />
                      <label htmlFor="passType">
                        {showPass ? "hide password" :"show password "}
                      </label>
                    </div>
                <div className="form-group my-3">
                  <button type="submit" className={"btn btn-success w-100" + (isLoading?" disabled":" ")}>
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
