import React, { useEffect, useState } from "react";
import logo from "../../../assets/images/1.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { Helmet } from "react-helmet";

export default function ResetPass() {
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
    getValues,
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
    reset(); //to Reset-form
    axios
      .post(`${baseUrl}/api/v1/Users/Reset`, data)
      .then((response) => {
        // console.log(response);
        toast.success(response.data.message);
        navigate("/login");
        setIsLoading(false);
      })
      .catch((error) => {
        // console.log(error.response);
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
        <title>Reset Password</title>
      </Helmet>
      <div className="Auth-container  container-fluid">
        <div className="row bg-overlay vh-100 justify-content-center align-items-center ">
          <div className="col-md-6">
            <div className="bg-white rounded-4 p-2">
              <div className="logo-cont text-center">
                <img src={logo} className="w-25" alt="logo" />
              </div>
              <form className="w-75 m-auto" onSubmit={handleSubmit(onSubmit)}>
                <h2> Reset Password</h2>
                <p className="text-muted">
                  Please Enter Your Otp or Check Your Inbox
                </p>
                <div className="form-group my-3 position-relative">
                  <i className="fa-regular fa-envelope  position-absolute"></i>
                  <input
                    className="form-control bgMain ps-4"
                    type="email"
                    placeholder="Email"
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
                <div className="form-group my-3 position-relative">
                  <i className="fa-solid fa-lock position-absolute"></i>
                  <input
                    className="form-control bgMain ps-4"
                    type="text"
                    placeholder="OTP"
                    {...register("seed", {
                      required: true,
                    })}
                  />
                  {errors.seed && errors.seed.type === "required" && (
                    <span className="text-danger">OTP is required!!</span>
                  )}
                </div>
                <div className="form-group my-3 position-relative ">
                  <i className="fa-solid fa-lock position-absolute"></i>
                  <input
                    className="form-control bgMain ps-4"
                    type={passType}
                    placeholder="New Password"
                    {...register("password", {
                      required: true,
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{6,}$/,
                    })}
                  />
                  {errors.password && errors.password.type === "required" && (
                    <span className="text-danger">Password is required!!</span>
                  )}
                  {errors.password && errors.password.type === "pattern" && (
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
                    {...register("confirmPassword", {
                      required: true,
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{6,}$/,
                      validate: {
                        checkNewPassConfirmationHandler: (value) => {
                          const { password } = getValues();
                          return (
                            password === value ||
                            "Newpassword and ConfirmNewPassword doesn't match!!"
                          );
                        },
                      },
                    })}
                  />
                  {errors.confirmPassword && (
                    <span className="text-danger">
                      {errors.confirmPassword?.message}
                    </span>
                  )}

                  {errors.confirmPassword &&
                    errors.confirmPassword.type === "required" && (
                      <span className="text-danger">
                        ConfirmPassword is required!!
                      </span>
                    )}

                  {errors.confirmPassword &&
                    errors.confirmPassword.type === "pattern" && (
                      <span className="text-danger">
                        The confirmPassword must include at least one lowercase
                        letter, one uppercase letter, one digit, one special
                        character, and be at least 6 characters long!!
                      </span>
                    )}
                </div>

                <div className="form-group my-2">
                  <input
                    className="mx-1"
                    type="checkbox"
                    name="passType"
                    checked={showPass}
                    onChange={(e) => {
                      setShowPass((prev) => !prev);
                    }}
                  />
                  <label htmlFor="passType">
                    {showPass ? "hide password" : "show password "}
                  </label>
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
                      "Reset Password"
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
