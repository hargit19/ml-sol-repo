import React, { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginFlow } from "../../api/authenticationFlow.js";
import { useAuth } from "../../context/AuthProvider.js";
import InputFieldWithLabel from "../InputComponent.js";
import ResetEmailModal from "../Modal/ForgotPasswordModal.js";

function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);

  async function handleSubmitLogin(event) {
    event.preventDefault();
    const result = await loginFlow({ email, password });
    setEmail("");
    setPassword("");
    if (result.status === "success") {
      setUser(result.data.user);
      if (!result.data.user.verifiedEmail) navigate("/verify-email/" + result.data.user.email);
      else if (!result.data.user.verifiedPhone) navigate("/verify-phone/" + result.data.user.phone);
      else navigate("/dashboard/main");
    } else {
      toast.error("Something went wrong!");
    }
  }

  function handleOpenResetModal() {
    setShowResetModal(true);
  }

  function handleCloseModal() {
    setShowResetModal(false);
  }

  return (
    <div className="form__container">
      <Link to="/" className="back-to-home">
        <AiOutlineArrowLeft />
      </Link>
      <form className="form" onSubmit={handleSubmitLogin}>
        <p className="signup__title">LOGIN</p>

        <div className="form__fields">
          <InputFieldWithLabel 
            type="email" 
            field="Email" 
            value={email} 
            setValue={setEmail} 
          />

          <InputFieldWithLabel 
            type="password" 
            field="Password" 
            value={password} 
            setValue={setPassword} 
          />
        </div>

        <button className="signup__btn" type="submit">
          Login
        </button>
        
        <Link to={"/signup"} className="forgotP">
          Not a member? Sign up
        </Link>
        
        <p className="forgotP" onClick={handleOpenResetModal}>
          Forgot password?
        </p>
      </form>

      <ResetEmailModal 
        isOpen={showResetModal} 
        closeModal={handleCloseModal} 
        setShowResetModal={setShowResetModal} 
      />
    </div>
  );
}

export default Login;