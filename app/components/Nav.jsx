"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuthState, useAuthDispatch } from "@/app/utils/AuthContext";

const Nav = () => {
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleClickOutside = event => {
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
      setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 mb-5 text-black shadow-lg border border-gray-300 bg-white z-10">
        <div className="flex-1">
          <Link href="/" className="text-xl font-bold">
            E-Learn
          </Link>
        </div>
        <nav className="hidden md:flex flex-1 justify-center text-sm space-x-4">
          <Link href="/">Explore</Link>
        </nav>
        <div className="hidden md:flex flex-1 justify-end items-center space-x-4">
          {user ? (
            <div className="relative">
              <button onClick={toggleDropdown} className="text-sm font-bold py-2 px-4 rounded">
                {user.name}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded">
                  <Link href="/my-courses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Courses
                  </Link>
                  <Link href="/my-account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Account
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              )}
            </div>
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
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        {isMobileMenuOpen && (
          <nav
            ref={mobileMenuRef}
            className="md:hidden absolute top-16 left-0 w-full bg-white border-t text-center border-gray-300 shadow-lg">
            <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Explore
            </Link>
            {user ? (
              <>
                <Link href="/my-courses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  My Courses
                </Link>
                <Link href="/my-account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  My Account
                </Link>
                <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/sign-in" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="block px-4 py-2 text-sm bg-black text-white font-bold focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:bg-white hover:text-black hover:border hover:border-black">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        )}
      </header>
      <main className="pt-20">{/* Your page content goes here */}</main>
    </>
  );
};

export default Nav;
