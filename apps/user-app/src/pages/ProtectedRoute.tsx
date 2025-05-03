import { JSX, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useUser } from "../atoms/usecontext";
import { User } from "../types/types";



axios.defaults.withCredentials = true;

interface ProtectedRouteProps {
  children: ReactNode; // Define the type for children
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  
//   const {signIn, signOut}= useAuth();
    const {user, signIn, signOut} = useUser();

    
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/v1/user/protected`)
      .then((res) => {
        console.log("User is logged in", res.data);
         const loggeduser: User = {
                    email: res.data.email,
                    name:res.data.name,
                    id: res.data.id,
                    
                 }
                 console.log(` user in protected route = ${loggeduser.email}, ${loggeduser.name}, ${loggeduser.id}`);
                signIn(loggeduser);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          console.log("Not authenticated");
          signOut();
        console.log(`user after sign out = `, user);
          navigate("/signin");
        } else {
          console.error("Other error", err);
          // maybe show a different error message
        }
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  console.log("HERE");
  return <>{children}</>;
}
