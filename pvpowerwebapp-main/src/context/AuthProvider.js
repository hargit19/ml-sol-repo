import { createContext, useCallback, useContext, useState } from "react";
import { isLoggedIn, logoutFlow } from "../api/authenticationFlow";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  async function handleLogout() {
    const result = await logoutFlow();
    if (result.status === "success") {
      setUser(null);
      toast.success("You are logged out");
      navigate("/login");
    } else {
      toast.error("Something went wrong!");
    }
  }

  const handleIsLoggedIn = useCallback(async () => {
    const result = await isLoggedIn();
    if (result.status === "success") {
      setUser(result.data.user);
    } else {
      toast.warn("Please login to continue");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout, handleIsLoggedIn }}>
      {children}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export function useAuth() {
  return useContext(AuthContext);
}
