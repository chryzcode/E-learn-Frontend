import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuthState, useAuthDispatch } from "@/app/utils/AuthContext";
import { HiChevronDown } from "react-icons/hi";

const Nav = () => {
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Refs for the dropdown and mobile menu
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
    setMobileMenuOpen(false); // Ensure mobile menu is closed when dropdown is open
  };

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
    setDropdownOpen(false); // Ensure dropdown is closed when mobile menu is open
  };

  // Handle click outside of dropdown
  const handleClickOutsideDropdown = event => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  // Handle click outside of mobile menu
  const handleClickOutsideMobileMenu = event => {
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
      setMobileMenuOpen(false);
    }
  };

  // Add and remove event listeners for clicks outside
  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutsideDropdown);
    }

    return () => {
      document.removeEventListener("click", handleClickOutsideDropdown);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutsideMobileMenu);
    }

    return () => {
      document.removeEventListener("click", handleClickOutsideMobileMenu);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between p-6 mb-5 text-black shadow-lg border border-gray-300 bg-white z-10">
        <div className="flex-1">
          <Link href="/" className="text-2xl font-bold">
            E-Learn
          </Link>
        </div>
        <nav className="hidden md:flex flex-1 justify-center text-base space-x-6">
          {user && user.user.userType == "Instructor" ? <Link href="/instructor/create">Create</Link> : null}
          <Link href="/course">Courses</Link>
          <Link href="/">Explore</Link>
        </nav>
        <div className="hidden md:flex flex-1 justify-end items-center space-x-6">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="flex items-center space-x-2 text-base">
                <span>{user.user.fullName}</span>
                <HiChevronDown />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded">
                  <Link href="/course/my-courses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Courses
                  </Link>
                  <Link href="/my-wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My WishList
                  </Link>
                  <Link href="/my-account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Account
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      dispatch({ type: "LOGOUT" });
                      setDropdownOpen(false);
                    }}
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
                className="bg-black text-white font-bold py-2 px-4 shadow-md focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:bg-white hover:text-black hover:border hover:border-black">
                Sign Up
              </Link>
            </>
          )}
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="focus:outline-none shadow-md">
            <svg
              className="w-8 h-8"
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
            className="md:hidden absolute top-16 left-0 text-center right-0 bg-white border-t border-gray-300 shadow-lg z-10 flex flex-col">
            {user && user.user.userType == "Instructor" ? (
              <Link
                href="/instructor/create"
                className="block px-4 py-4 text-base text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}>
                Create
              </Link>
            ) : null}
            <Link
              href="/course"
              className="block px-4 py-4 text-base text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}>
              Courses
            </Link>
            <Link
              href="/"
              className="block px-4 py-4 text-base text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}>
              Explore
            </Link>
            {user ? (
              <>
                <Link
                  href="/course/my-courses"
                  className="block px-4 py-4 text-base text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}>
                  My Courses
                </Link>
                <Link
                  href="/my-wishlist"
                  className="block px-4 py-4 text-base text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}>
                  My WishList
                </Link>
                <Link
                  href="/my-account"
                  className="block px-4 py-4 text-base text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}>
                  My Account
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-4 text-base text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}>
                  Settings
                </Link>
                <button
                  onClick={() => {
                    dispatch({ type: "LOGOUT" });
                    setMobileMenuOpen(false);
                  }}
                  className="block px-4 py-4 text-base bg-black text-white font-bold shadow-md focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:bg-white hover:text-black hover:border hover:border-black">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/sign-in"
                  className="block px-4 py-4 text-base text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="block px-4 py-4 text-base bg-black text-white font-bold shadow-md focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:bg-white hover:text-black hover:border hover:border-black"
                  onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        )}
      </header>
      <main className="pt-24">{/* Your page content goes here */}</main>
    </>
  );
};

export default Nav;
