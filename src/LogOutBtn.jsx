import { signOut } from "firebase/auth";
import { auth } from "./Firebase";
import { useNavigate } from "react-router-dom";

const LogOutBtn = () => {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
      console.log("User signed out");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return <button onClick={logout}>Logout</button>;
};
export default LogOutBtn;
