import React, { useState } from "react";
import Logo from "../images/logo.jpg";
import { useDispatch, useSelector } from "react-redux";
import { logIn, signUp } from "../actions/AuthAction";

const Auth = () => {
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(true);
  const loading = useSelector((state) => state.authReducer.loading);
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    password: "",
    confirmpass: "",
    username: "",
  });
  const [confirmpass, setConfirmPass] = useState(true);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      data.password === data.confirmpass
        ? dispatch(signUp(data))
        : setConfirmPass(false);
    } else {
      dispatch(logIn(data));
    }
  };

  const resetForm = () => {
    setConfirmPass(true);
    setData({
      firstname: "",
      lastname: "",
      password: "",
      confirmpass: "",
      username: "",
    });
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen gap-8 relative">
      {/* Left */}
      <div className="flex flex-col items-center justify-center gap-8 order-2 md:order-none text-center md:text-left">
        <img src={Logo} alt="" className="w-16 h-16" />
        <div className="Webname">
          <h1 className="text-5xl bg-gradient-to-r from-yellow-500 via-orange-400 to-orange-600 bg-clip-text text-transparent font-bold">
            new
          </h1>
          <h6 className="text-sm md:text-base">
            Explore the ideas throughout the world
          </h6>
        </div>
      </div>

      {/* Right */}
      <div className="flex justify-center items-center w-full md:w-auto">
        <form
          className="flex flex-col items-center justify-center gap-8 bg-white/70 rounded-xl p-4 w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <h3 className="text-xl font-semibold">
            {isSignUp ? "Sign Up" : "Log in"}
          </h3>

          {isSignUp && (
            <div className="flex gap-4 w-full h-10">
              <input
                type="text"
                placeholder="First Name"
                className="flex-1 rounded-lg p-3 bg-black/5 outline-none text-sm"
                name="firstname"
                onChange={handleChange}
                value={data.firstname}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="flex-1 rounded-lg p-3 bg-black/5 outline-none text-sm"
                name="lastname"
                onChange={handleChange}
                value={data.lastname}
              />
            </div>
          )}

          <div className="flex gap-4 w-full h-10">
            <input
              type="text"
              className="flex-1 rounded-lg p-3 bg-black/5 outline-none text-sm"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              value={data.username}
            />
          </div>

          <div className="flex gap-4 w-full h-10">
            <input
              type="password"
              className="flex-1 rounded-lg p-3 bg-black/5 outline-none text-sm"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={data.password}
            />
            {isSignUp && (
              <input
                type="password"
                className="flex-1 rounded-lg p-3 bg-black/5 outline-none text-sm"
                name="confirmpass"
                placeholder="Confirm Password"
                onChange={handleChange}
                value={data.confirmpass}
              />
            )}
          </div>

          <span
            className={`text-red-500 text-xs self-end mr-1 ${
              confirmpass ? "hidden" : "block"
            }`}
          >
            *Password does not match
          </span>

          <div className="w-full text-center text-sm cursor-pointer">
            <span
              onClick={() => {
                setIsSignUp((prev) => !prev);
                resetForm();
              }}
              className="text-blue-600 underline"
            >
              {isSignUp
                ? "Already have an account? Login!"
                : "Don't have an account? Sign Up!"}
            </span>
          </div>

          <button
            className="w-24 h-8 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-md font-semibold hover:from-transparent hover:border-2 hover:border-orange-400 hover:text-orange-400 transition-all duration-200 disabled:bg-gray-400"
            disabled={loading}
            type="submit"
          >
            {loading ? "Loading" : isSignUp ? "Sign Up" : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
