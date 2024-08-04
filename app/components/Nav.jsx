"use client";

import React from "react";
import Link from "next/link";
import { useAuthState, useAuthDispatch } from "@/app/utils/AuthContext";

const Nav = () => {
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <header className="flex items-center justify-between px-4 py-6  text-black shadow-lg border border-gray-300">
      <div>
        <Link href="/" className="text-xl font-bold">
          E-Learn
        </Link>
      </div>
      <nav className="flex items-center text-sm space-x-4">
        <Link href="/">Explore</Link>
        {user ? (
          <>
            <Link href="/my-courses">My Courses</Link>
            <Link href="/my-account">My Account</Link>
            <Link href="/settings">Settings</Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/sign-in">Sign In</Link>
            <Link
              href="/auth/sign-up"
              className="bg-black text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline w-full md:w-auto transition duration-300 ease-in-out transform hover:bg-white hover:text-black hover:border hover:border-black">
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Nav;
