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
    <header className="flex items-center justify-between p-4  text-black border border-gray-300">
      <div>
        <Link href="/" className="text-xl font-bold">
          E-Learn
        </Link>
      </div>
      <nav className="flex items-center space-x-4">
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
            <Link href="/auth/sign-up">Sign Up</Link>
            <Link href="/auth/sign-in">Sign In</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Nav;
