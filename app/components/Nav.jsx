import React from "react";
import Link from "next/link";


const Nav = () => {
  return (

      <header className="flex align-middle space-between text-2xl">
        <Link href="/">E-Learn</Link>

        <span>Explore</span>

        <Link href="/auth/sign-up">Sign Up</Link>

        <Link href="/auth/sign-in">Sign in</Link>
      </header>
  );
};

export default Nav;
