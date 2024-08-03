"use client";

import { Inter } from "next/font/google";
import { AuthProvider } from "@/app/utils/AuthContext";
import Nav from "./components/Nav";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

const ClientLayout = ({ children }) => {
  return (
    <AuthProvider>
      <div className={inter.className}>
        <Nav />
        {children}
        <ToastContainer />
      </div>
    </AuthProvider>
  );
};

export default ClientLayout;
