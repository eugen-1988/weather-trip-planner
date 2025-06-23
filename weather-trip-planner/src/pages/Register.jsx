// src/pages/Register.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { MdEmail, MdLockOutline, MdPerson } from "react-icons/md";
import { BiUserPlus } from "react-icons/bi";

const Register = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ fullName, email, password }) => {
    try {
      await signup(email, password, fullName);
      toast.success(`Welcome, ${fullName}!`);
      navigate("/home");
    } catch (error) {
      toast.error("Registration failed: " + error.message);
    }
  };

  return (
    <motion.div
      className="w-full max-w-md rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.15)] 
    p-10 text-gray-800 border border-gray-400 bg-zinc-800/40 backdrop-blur-xl 
    hover:scale-[1.01] transition-transform duration-300 ease-in-out"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="flex justify-center mb-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <BiUserPlus className="text-5xl text-green-600 drop-shadow-md animate-bounce" />
      </motion.div>
      <h2
        className="text-4xl font-extrabold mb-8 text-center tracking-wide 
          text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500 
          animate-gradient-x transition-all duration-500 ease-in-out drop-shadow-md"
      >
        Create Account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="flex items-center gap-2 mb-1 text-sm font-medium text-green-700">
            <MdPerson className="text-xl text-green-600" />
            Full Name
          </label>
          <input
            type="text"
            placeholder="Your full name"
            {...register("fullName", { required: "Full name is required." })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 
              bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 
              focus:ring-green-400 transition-all placeholder:italic placeholder:text-gray-400"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 mb-1 text-sm font-medium text-green-700">
            <MdEmail className="text-xl text-green-600" />
            Email
          </label>
          <input
            type="email"
            placeholder="Email address"
            {...register("email", { required: "Email is required." })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 
              bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 
              focus:ring-green-400 transition-all placeholder:italic placeholder:text-gray-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 mb-1 text-sm font-medium text-green-700">
            <MdLockOutline className="text-xl text-green-600" />
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required.",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long.",
              },
            })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 
              bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 
              focus:ring-green-400 transition-all placeholder:italic placeholder:text-gray-400"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-2/3 mx-auto flex items-center justify-center gap-2 
            text-white py-2 rounded-full bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500 
            hover:from-yellow-400 hover:via-orange-500 hover:to-red-500 
            transition-all duration-300 shadow-md active:scale-95"
        >
          <BiUserPlus className="text-lg" />
          Sign Up
        </button>
      </form>

      <p className="text-sm text-center mt-8 text-gray-200 font-medium">
        Already have an account?
        <span className="ml-1">
          <Link
            to="/login"
            className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 
                     bg-clip-text text-transparent font-semibold 
                     transition-all duration-300 transform hover:scale-110
                     hover:from-pink-400 hover:via-fuchsia-500 hover:to-yellow-300"
          >
            Login
          </Link>
        </span>
      </p>
    </motion.div>
  );
};

export default Register;
