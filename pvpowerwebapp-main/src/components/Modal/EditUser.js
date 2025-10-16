import React, { useState } from "react";
import ReactDom from "react-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../api/axiosInstance";

import "../../css/Modal/EditUser.css";

function EditUser({ open, closeModal, user }) {
  const [verifyCode, setVerifyCode] = useState("");
  const [showVerifyModal, setVerifyModal] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState(user.address);
  const [username, setUsername] = useState(user.username);
  const [phone, setPhone] = useState(user.phone);

  const saveInfo = async (e) => {
    e.preventDefault();
    setVerifyModal(true);
    const result = await axiosInstance.post(`/api/send-sms/`, { phone });
    console.log("code sent result: ", result);
  };

  const closeModalPhone = () => {
    setVerifyModal(false);
    setVerifyCode("");
  };

  const handleVerify = async () => {
    const result = await axiosInstance.post(`/api/edit/${user._id}`, {
      email,
      username,
      verifyCode,
      address,
      phone,
    });

    if (result.status === 200) {
      toast.success("Successfully updated!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "light",
      });
      window.location.reload();
      closeModal();
      closeModalPhone();
    }
  };

  if (!open) return null;
  return ReactDom.createPortal(
    <>
      <div className="edit__wrapper" onClick={closeModal}></div>
      <div className="edit__container">
        <div className="edit__info">
          <h1>Edit Account</h1>
          <div className="edit__name  editOpt">
            <label htmlFor="username">Full name : </label>
            <input
              type="text"
              value={username}
              id="username"
              name="username"
              className="account-input"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className=" edit__email  editOpt">
            <label htmlFor="email">Email : </label>
            <input
              type="email"
              value={email}
              id="email"
              name="email"
              className="account-input"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className=" edit__phone  editOpt">
            <label htmlFor="phone">Phone : </label>
            <input
              type="tel"
              value={phone}
              id="phone"
              name="phone"
              className="account-input"
              required
              onChange={(event) => {
                const numiricalValueOnly = event.target.value.replace(/[^0-9]/g, "");
                setPhone(numiricalValueOnly);
              }}
            />
          </div>

          <div className=" edit__addr  editOpt">
            <label htmlFor="address">Billing Address : </label>
            <input
              type="text"
              value={address}
              id="address"
              name="address"
              className="account-input"
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="edit__btns">
            <button className="save_new_info" onClick={saveInfo}>
              Save
            </button>
            <button className="cancel_new_info" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      {/* <VerifyPhone open={showVerifyModal} closeModalPhone={closeModalPhone}>
        <div className="verify__heading">
          <h2>Verify Phone</h2>
          <p style={{ color: "black" }}>Verification code is sent on your new phone number.</p>
          <input
            type="number"
            className="code_input"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
            placeholder="Enter your 4 digit code"
            required
          />
          <button className="signup__btn" onClick={handleVerify}>
            Update
          </button>
        </div>
      </VerifyPhone> */}
    </>,
    document.getElementById("edit_user")
  );
}

export default EditUser;
