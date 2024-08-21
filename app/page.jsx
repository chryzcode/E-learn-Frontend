"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuthState } from "@/app/utils/AuthContext";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

const Page = () => {
  const { user } = useAuthState();
  const [showFirstHeroImage, setShowFirstHeroImage] = useState(true);

  useEffect(() => {
    const heroImageTimer = setTimeout(() => {
      setShowFirstHeroImage(!showFirstHeroImage);
    }, 3000); // Toggle the hero images every 3 seconds

    return () => clearTimeout(heroImageTimer);
  }, [showFirstHeroImage]);

  return (
    <div className="w-10/12 mx-auto">
      {/* Hero Section */}
      <div className="text-center flex align-middle justify-center items-center flex-col">
        <motion.div
          className="py-5"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>
          <div style={{ position: "relative", width: "200px", height: "200px" }}>
            <Image
              src="../images/online_video.svg"
              alt="Online Video Illustration"
              width={200}
              height={200}
              style={{
                opacity: showFirstHeroImage ? 1 : 0,
                transition: "opacity 1s ease-in-out",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
            <Image
              src="../images/video_upload.svg"
              alt="Upload Video Illustration"
              width={200}
              height={200}
              style={{
                opacity: showFirstHeroImage ? 0 : 1,
                transition: "opacity 1s ease-in-out",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
          </div>
        </motion.div>
        <p className="py-3 text-2xl max-w-xl mx-auto">
          Create video content, learn, teach and earn for free on <span className="font-bold">E-[nternet] Learn</span>
        </p>
        <div className="flex justify-center items-center">
          {user ? (
            <Link href="/courses">
              <motion.div
                className="my-5 bg-white text-black py-2 px-8 hover:cursor-pointer focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:bg-black hover:text-white border border-black w-max text-base"
                whileHover={{ scale: 1.1 }}>
                View Courses
              </motion.div>
            </Link>
          ) : (
            <Link href="/signup">
              <motion.div
                className="my-5 bg-white text-black py-2 px-8 hover:cursor-pointer focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:bg-black hover:text-white border border-black w-max text-base"
                whileHover={{ scale: 1.1 }}>
                Sign Up
              </motion.div>
            </Link>
          )}
        </div>
      </div>

      <div className="my-20">
        {/* Instructor Section */}
        <motion.div
          className="my-10 text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}>
          <p className="text-2xl font-bold py-10 underline">As Instructors</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div whileHover={{ scale: 1.05 }} className="shadow-lg rounded-lg py-12 px-6">
              <Image src="../images/video_files.svg" width={200} height={200} className="ml-auto" />
              <p className=" py-5 md:text-lg text-sm">Teach on any field - create content and upload</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="shadow-lg rounded-lg py-12 px-6">
              <Image src="../images/video_streaming.svg" width={150} height={150} className="ml-auto" />
              <p className=" py-5 md:text-lg text-sm">Enroll for other instructor courses</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="shadow-lg rounded-lg py-12 px-6">
              <Image src="../images/pay_online.svg" width={150} height={150} className="ml-auto" />
              <p className="py-5 md:text-lg text-sm">Content monetization</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="shadow-lg rounded-lg py-12 px-6">
              <Image src="../images/tutorial_video.svg" width={200} height={200} className="ml-auto" />
              <p className=" py-5 md:text-lg text-sm">Create unlimited content</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="shadow-lg rounded-lg py-12 px-6">
              <Image src="../images/messaging.svg" width={180} height={180} className="ml-auto" />
              <p className=" py-5 md:text-lg text-sm">Interactive communication with students</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="shadow-lg rounded-lg py-12 px-6">
              <Image src="../images/secure_files.svg" width={200} height={200} className="ml-auto" />
              <p className=" py-5 md:text-lg text-sm">Content efficiently secured</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Student Section */}
        <motion.div
          className="my-20 text-right"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}>
          <p className="text-2xl font-bold py-10 underline">As Students</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.05 }} className="shadow-lg rounded-lg py-12 px-6">
              <Image src="../images/online_learning.svg" width={150} height={150} />
              <p className=" py-5 md:text-lg text-sm">Accessibility to courses (free)</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="shadow-lg rounded-lg py-12 px-6">
              <Image src="../images/real_time_collaboration.svg" width={150} height={150} />
              <p className="py-5 md:text-lg text-sm">Interaction with colleagues and instructor</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="shadow-lg rounded-lg py-12 px-6">
              <Image src="../images/active_support.svg" width={150} height={150} />
              <p className=" py-5 md:text-lg text-sm">24/7 support and assistance</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="shadow-lg rounded-lg py-12 px-6">
              <Image src="../images/wishlist.svg" width={180} height={180} />
              <p className=" py-5 md:text-lg text-sm">Wishlist favorite courses</p>
            </motion.div>
          </div>
        </motion.div>

        <div className="flex items-center space-x-2 flex-col text-center">
          <p className="text-2xl font-semibold">You have anything for us?</p>
          <div className="py-3">
            <a href="mailto:alabaolanrewaju13@gmail.com" className="underline flex items-center">
              <span>alabaolanrewaju13@gmail.com</span>
              <FaArrowRight className="ml-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
