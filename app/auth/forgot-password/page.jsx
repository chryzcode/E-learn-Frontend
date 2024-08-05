"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for useRouter in App Router
import { toast } from "react-toastify";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const BACKEND_URL = "https://e-learn-l8dr.onrender.com";

  const handleSubmit = async e => {
    e.preventDefault();

    const response = await fetch(`${BACKEND_URL}/send-forgot-password-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.msg || "Forgot password failed";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    toast.success("Check your mail!");
    router.push("/auth/sign-in");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 md:p-10 shadow-lg mx-auto bg-white border border-gray-300 rounded-lg">
        <p className="text-2xl text-customPurple font-semibold text-center py-5 md:py-7">Forgot Password?</p>
        <form onSubmit={handleSubmit}>
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
          <div className="text-center">
            <button
              className="bg-black text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:bg-white hover:text-black hover:border hover:border-black"
              type="submit">
              Get Mail
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
