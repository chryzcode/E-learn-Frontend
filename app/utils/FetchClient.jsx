export async function fetchClient(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers, // Spread any custom headers
    },
  });

  if (response.status === 401) {
    // Token has expired, log the user out
    signOutUser();
  }

  return response;
}

function signOutUser() {
  // Clear any stored tokens or session data
  // Redirect the user to the login page
  window.location.href = "/auth/sign-in"; // Adjust the URL to your login page
}
