import { toast } from "react-toastify";

export async function fetchClient(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers, // Spread any custom headers
    },
  });

  if (response.status === 401) {
    // Token has expired, log the user out with a toast message
    signOutUser();
  }

  return response;
}

function signOutUser() {
  // Show a toast message before redirecting
  toast.info("Your session has expired. Please log in again.");

  // Clear any stored tokens or session data
  // Redirect the user to the login page
  setTimeout(() => {
    window.location.href = "/auth/sign-in"; // Adjust the URL to your login page
  }, 2000); // Delay the redirect to allow the toast to be seen
}
