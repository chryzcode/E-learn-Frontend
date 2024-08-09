import { useAuthState } from "./AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withAuth = WrappedComponent => {
  return props => {
    const { user } = useAuthState();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push("/"); // Adjust the login path as needed
      }
    }, [user, router]);

    if (!user) {
      return null; // Or you can return a loading spinner while redirecting
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
