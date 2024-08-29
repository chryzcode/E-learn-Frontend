"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Spinner from "@/app/components/Spinner";
import { useAuthState } from "@/app/utils/AuthContext";

const SignUpPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("Student");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuthState();

  const BACKEND_URL = "https://e-learn-l8dr.onrender.com";

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, password, userType }),
      });

      const data = await response.json();
      console.log(data.msg);

      if (!response.ok) {
        const errorMessage = data.msg || data.error || "Sign-up failed";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      toast.success("Check mail for verification!");
      router.push("/auth/sign-in");
    } catch (error) {
      toast.error("Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    router.push("/");
  }


  return (
    <div className="mx-4 md:mx-10">
      <p className="text-2xl text-customPurple font-semibold mx-auto text-center py-5 md:py-7">Sign Up</p>
      <p className="text-center">
        Do have an E-learn account?{" "}
        <a href="/auth/sign-in" className="text-customPurple hover:underline font-semibold">
          Sign in
        </a>
      </p>
      <div className="flex-wrap-container py-5 align-middle px-2 md:px-10">
        <div className="border border-gray-300 p-4 md:p-6 shadow-lg mx-auto max-w-md">
          <form className="" onSubmit={handleSubmit}>
            <div className="my-3">
              <label htmlFor="fullName" className="block mb-2 text-sm">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={fullName}
                onChange={e => {
                  setFullName(e.target.value);
                }}
                className="border w-full py-2 px-3 mb-2"
                placeholder="John Doe"
                required
              />
            </div>

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

            <div className="mb-4">
              <label htmlFor="userType" className="block mb-2 text-sm">
                Account Type
              </label>
              <select
                id="userType"
                name="userType"
                className="border w-full py-2 px-3 mb-2"
                required
                value={userType}
                onChange={e => setUserType(e.target.value)}>
                <option value="Student">Student</option>
                <option value="Instructor">Instructor</option>
              </select>
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

            <div className="flex justify-center my-6 md:my-8">
              <button
                className="bg-black text-white font-bold py-2 px-8 focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:bg-white hover:text-black hover:border hover:border-black"
                type="submit">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
      {loading && <Spinner />}
    </div>
  );
};

export default SignUpPage;
