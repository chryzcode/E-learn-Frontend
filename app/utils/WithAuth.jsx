import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/app/utils/AuthContext";
import Spinner from "@/app/components/Spinner";

const WithAuth = WrappedComponent => {
  return props => {
    const { user, loading } = useAuthState();
    const router = useRouter();
    useEffect(() => {
      if (!loading && !user) {
        router.push("/"); // Redirect to login page or any other path
      }
    }, [user, loading, router]);

    if (loading) {
      return <Spinner />; // Display spinner while loading
    }

    if (!user) {
      return null; // Optionally, return null or a different component while redirecting
    }

    return <WrappedComponent {...props} />;
  };
};

export default WithAuth;
