"use client";

import React, { createContext, useReducer, useContext, useEffect } from "react";

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case "LOGOUT":
      localStorage.removeItem("user");
      return {
        ...state,
        user: null,
        loading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: true,
      };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null, loading: true });

  useEffect(() => {
    dispatch({ type: "SET_LOADING" });
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        dispatch({ type: "LOGIN", payload: user });
      } else {
        dispatch({ type: "SET_LOADING" }); // Set loading to false if no user is found
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      dispatch({ type: "SET_LOADING" }); // Ensure loading is turned off in case of error
    }
  }, []);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);
