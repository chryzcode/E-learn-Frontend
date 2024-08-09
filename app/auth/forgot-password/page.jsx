"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for useRouter in App Router
import { toast } from "react-toastify";
import Spinner from "../components/Spinner"; // Import the Spinner component

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Manage loading state
  const router = useRouter();

  const BACKEND_URL = "https://e-learn-l8dr.onrender.com";

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the form is submitted

    try {
      const response = await fetch(`${BACKEND_URL}/send-forgot-password-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.msg || data.error || "Forgot password failed";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      toast.success("Check your mail!");
      router.push("/auth/sign-in");
    } catch (error) {
      console.log("Forgot password failed");
    } finally {
      setLoading(false); // Set loading to false when the request is completed
    }
  };

  return (
    <div className="mx-4 md:mx-10">
      <p className="text-2xl text-customPurple font-semibold mx-auto text-center py-5 md:py-7">Forgot Password?</p>
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

            <div className="mx-auto w-24 md:w-32 my-6 md:my-8 text-center">
              <button
                className="bg-black text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline w-auto md:w-auto transition duration-300 ease-in-out transform hover:bg-white hover:text-black hover:border hover:border-black"
                type="submit">
                Get Mail
              </button>
            </div>
          </form>
        </div>
      </div>
      {loading && <Spinner />} {/* Conditionally render the spinner */}
    </div>
  );
};

export default ForgotPasswordPage;
