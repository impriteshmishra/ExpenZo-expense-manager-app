import React, { useEffect, useState } from "react";
import "./styleHeader.css";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import defaultImage from "../../assets/profile.jpg";

function Header() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState()

  function logoutFunction() {
    // try {
    //   signOut(auth)
    //     .then(() => {
    //       // Sign-out successful.
    //       toast.success("Logout successfully");
    //       navigate("/");
    //     })
    //     .catch((error) => {
    //       // An error happened.
    //       toast.error(error.message);
    //     });
    // } catch (error) {
    //   toast.error(error);
    // }

    auth.signOut();
    navigate("/");
  }

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  return (
    <div className="navbar">
      <p className="logo">ExpenZo</p>
      {/* this will check when user exist then logout. */}
      {user ? (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div className="profile">
            <img
              src={user.photoURL || defaultImage}
              alt="default"
              style={{
                borderRadius: "50%",
                height: "2.5rem",
                width: "2.5rem",
                marginLeft: "auto",
              }}
            />
          </div>

          <p className="logout" onClick={logoutFunction}>
            Logout
          </p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Header;
