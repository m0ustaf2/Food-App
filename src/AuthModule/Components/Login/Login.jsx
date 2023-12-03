import React, { useEffect, useState } from "react";
import logo from "../../../assets/images/1.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { Helmet } from "react-helmet";

export default function Login({ saveAdminData }) {
  let { baseUrl } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [passType, setPassType] = useState("password");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    setIsLoading(true);
    axios
      .post(`${baseUrl}/api/v1/Users/Login`, data)
      .then((response) => {
        localStorage.setItem("adminToken", response.data.token);
        saveAdminData();
        reset(); //to Reset-form
        // console.log(data);
        toast.success("Login Success");
        navigate("/dashboard");
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (showPass) {
      setPassType("text");
      return;
    }
    setPassType("password");
  }, [showPass]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Login</title>
      </Helmet>
      <div className="Auth-container  container-fluid">
        <div className="row bg-overlay vh-100 justify-content-center align-items-center ">
          <div className="col-md-6">
            <div className="bg-white rounded-4 p-2">
              <div className="logo-cont text-center">
                <img src={logo} className="w-25" alt="logo" />
              </div>
              <form className="w-75 m-auto" onSubmit={handleSubmit(onSubmit)}>
                <h2>Log In</h2>
                <p className="text-muted">
                  Welcome Back! Please enter your details.
                </p>
                <div className="form-group my-3 position-relative">
                  <i className="fa-solid fa-mobile-screen-button position-absolute"></i>
                  <input
                    className="form-control bgMain ps-4"
                    type="email"
                    placeholder="Enter your E-mail"
                    {...register("email", {
                      required: true,
                      pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                    })}
                  />
                  {errors.email && errors.email.type === "required" && (
                    <span className="text-danger">email is required!!</span>
                  )}
                  {errors.email && errors.email.type === "pattern" && (
                    <span className="text-danger">invalid email!!</span>
                  )}
                </div>
                <div className="form-group my-3 position-relative ">
                  <i className="fa-solid fa-lock position-absolute"></i>
                  <input
                    className="form-control bgMain ps-4 "
                    type={passType}
                    placeholder="Password"
                    {...register("password", {
                      required: true,
                    })}
                  />
                  {errors.password && errors.password.type === "required" && (
                    <span className="text-danger">password is required!!</span>
                  )}
                </div>
                <div className="form-group my-2">
                  <input
                    className="mx-1"
                    type="checkbox"
                    name="passType"
                    checked={showPass}
                    onChange={(e) => {
                      console.log(showPass);
                      setShowPass((prev) => !prev);
                    }}
                  />
                  <label htmlFor="passType">
                    {showPass ? "hide password" : "show password "}
                  </label>
                </div>

                <div className="d-flex justify-content-between">
                  <Link className="text-decoration-none text-black">
                    Register Now?
                  </Link>
                  <Link
                    className="text-decoration-none text-success"
                    to={"/request-pass-reset"}
                  >
                    Forget Password?
                  </Link>
                </div>
                <div className="form-group my-3">
                  <button
                    type="submit"
                    className={
                      "btn btn-success w-100" + (isLoading ? " disabled" : " ")
                    }
                  >
                    {isLoading == true ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      "Login"
                    )}
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
