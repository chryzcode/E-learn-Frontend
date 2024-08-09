"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for useRouter in App Router
import { toast } from "react-toastify";
import { useAuthDispatch } from "@/app/utils/AuthContext";
import Spinner from "../components/Spinner"; // Import the Spinner component

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Manage loading state
  const dispatch = useAuthDispatch();
  const router = useRouter();

  const BACKEND_URL = "https://e-learn-l8dr.onrender.com";

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the form is submitted

    try {
      const response = await fetch(`${BACKEND_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.msg || data.error || "Sign-in failed";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      dispatch({ type: "LOGIN", payload: data });
      toast.success("Sign-in successful!");
      router.push("/");
    } catch (error) {
      toast.error("Sign-in failed");
    } finally {
      setLoading(false); // Set loading to false when the request is completed
    }
  };

  return (
    <div className="mx-4 md:mx-10">
      <p className="text-2xl text-customPurple font-semibold mx-auto text-center py-5 md:py-7">Sign In</p>
      <p className="text-center">
        Do not have an E-learn account?{" "}
        <a href="/auth/sign-up" className="text-customPurple hover:underline font-semibold">
          Sign up
        </a>
      </p>
      <div className="flex-wrap-container py-5 align-middle px-2 md:px-10">
        <div className="border border-gray-300 p-4 md:p-6 shadow-lg mx-auto max-w-md">
          <form className="" onSubmit={handleSubmit}>
            <div className="my-3">
              <label htmlFor="email" className="block mb-2 text-sm">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                }}
                className="border w-full py-2 px-3 mb-2"
                placeholder="johndoe@gmail.com"
                required
              />
            </div>

            <div className="my-3">
              <label htmlFor="password" className="block mb-2 text-sm">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                }}
                className="border w-full py-2 px-3 mb-2"
                placeholder="*********"
                required
              />
            </div>

            <div className="mx-auto w-24 md:w-32 my-6 md:my-8 text-center">
              <button
                className="bg-black text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline w-full md:w-auto transition duration-300 ease-in-out transform hover:bg-white hover:text-black hover:border hover:border-black"
                type="submit">
                Sign In
              </button>
            </div>
          </form>

          <div className="text-customPurple text-center hover:underline">
            <Link href="/auth/forgot-password" className="text-sm">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
      {loading && <Spinner />} {/* Conditionally render the spinner */}
    </div>
  );
};

export default SignInPage;
