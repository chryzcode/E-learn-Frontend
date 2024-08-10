"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import withAuth from "../utils/WithAuth";
import { useRouter } from "next/navigation";
import Spinner from "@/app/components/Spinner";

const SettingsPage = () => {
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = "https://e-learn-l8dr.onrender.com";
  const router = useRouter();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BACKEND_URL}/current-user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMessage = data.msg || data.error || "Failed to fetch user data";
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }

        setFullName(data.user.fullName);
      } catch (error) {
        toast.error(error.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [BACKEND_URL]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("avatar", avatar);
      if (password.length > 0) {
        formData.append("password", password);
      }

      const response = await fetch(`${BACKEND_URL}/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.msg || data.error || "Update failed";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Update local storage with the updated user data
      const updatedUser = {
        ...user,
        fullName: data.user.fullName,
        avatar: data.user.avatar,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const deactivateUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        const errorMessage = data.msg || data.success || "Deactivating account failed";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      localStorage.removeItem("user");
      toast.success("Deactivated account successfully!");
    } catch (error) {
      toast.error(error.message || "Deactivating account failed");
    } finally {
      setLoading(false);
    }
  };

  const onClickDeactivate = () => {
    const confirm = window.confirm("Are you sure you want to deactivate this account?");
    if (!confirm) return;
    deactivateUser();
  };

  return (
    <div className="mx-4 md:mx-10">
      <p className="text-2xl text-customPurple font-semibold mx-auto text-center py-5 md:py-7">Settings</p>

      <div className="flex-wrap-container py-5 align-middle px-2 md:px-10">
        <div className="p-4 md:p-6 mx-auto max-w-md">
          <form onSubmit={handleSubmit}>
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
              <label htmlFor="avatar" className="block mb-2 text-sm">
                Avatar
              </label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                onChange={e => setAvatar(e.target.files[0])}
                className="border w-full py-2 px-3 mb-2"
              />
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
              />
            </div>

            <div className="flex justify-center my-6 md:my-8">
              <button
                className="bg-black text-white font-bold py-2 px-8 focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:bg-white hover:text-black hover:border hover:border-black"
                type="submit">
               Update
              </button>
            </div>
          </form>

          <div className="flex justify-end">
            <button
              onClick={onClickDeactivate}
              className="bg-red-600 text-white font-bold py-2 px-4 focus:shadow-outline w-full md:w-auto transition duration-300 ease-in-out transform hover:bg-white hover:text-red-600 hover:border hover:border-red-600">
              Deactivate Account
            </button>
          </div>
        </div>
      </div>

      {loading && <Spinner />}
    </div>
  );
};

export default withAuth(SettingsPage);
