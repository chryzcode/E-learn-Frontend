import React from "react";
import Link from "next/link";

const Nav = () => {
  return (
    <header className="">
      <Link href="/">E-Learn</Link>

      <span className="flex justify-around">
        <span>Explore</span>

        <Link href="/auth/sign-up">Sign Up</Link>

        <Link href="/auth/sign-in">Sign in</Link>
      </span>
    </header>
  );
};

export default Nav;
