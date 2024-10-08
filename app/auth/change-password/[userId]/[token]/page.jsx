"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation"; // Use next/navigation for useRouter and useParams in App Router
import { toast } from "react-toastify";
import Spinner from "@/app/components/Spinner";

const ChangePasswordPage = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Manage loading state
  const router = useRouter();
  const { userId, token } = useParams();

  const BACKEND_URL = "https://e-learn-l8dr.onrender.com";

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the form is submitted

    try {
      const response = await fetch(`${BACKEND_URL}/auth/forgot-password/${userId}/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Change password failed";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      toast.success("Password Successfully changed!");
      router.push("/auth/sign-in");
    } catch (error) {
      console.log("Change password failed");
    } finally {
      setLoading(false); // Set loading to false when the request is completed
    }
  };

  return (
    <div className="mx-4 md:mx-10">
      <p className="text-2xl text-customPurple font-semibold mx-auto text-center py-5 md:py-7">Change Password</p>
      <div className="flex-wrap-container py-5 align-middle px-2 md:px-10">
        <div className="border border-gray-300 p-4 md:p-6 shadow-lg mx-auto max-w-md">
          <form className="" onSubmit={handleSubmit}>
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

            <div className="flex justify-center my-6 md:my-8">
              <button
                className="bg-black text-white font-bold py-2 px-8 focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:bg-white hover:text-black hover:border hover:border-black"
                type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {loading && <Spinner />} {/* Conditionally render the spinner */}
    </div>
  );
};

export default ChangePasswordPage;
