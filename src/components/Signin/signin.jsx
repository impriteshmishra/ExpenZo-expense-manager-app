import React, { useState } from "react";
import "./style.css";
import Input from "../Input/inputComp";
import Button from "../Button/Button";
import Linetext from "../linetext/linetext";
import { toast } from "react-toastify";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, provider } from "../../firebase";
import googleIcon from "../../assets/google.png";
import { useNavigate } from "react-router-dom";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function signinUsingEmail() {
    setLoading(true);
    if (email != "" && password != "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          toast.success(`Welcome back ${user.displayName}`);
          console.log(user);

          // now navigating to dashboard
          navigate("/dashboard");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
        });
    } else {
      toast.error("All fields are mandatory.");
      setLoading(false);
    }
  }
  function googleAuth() {
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log(user);
          setLoading(false);
          createDoc(user);
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          setLoading(false);
          toast.error(errorMessage);
          // ...
        });
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  }
  async function createDoc(user) {
    setLoading(true);
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        navigate("/dashboard");
        toast.success("Doc created");
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    } else {
      toast.success(`Welcome back ${user.displayName}`);
      navigate("/dashboard");
      setLoading(false);
    }
  }

  const navigateSignup = () => {
    navigate("/");
  };

  return (
    <div className="signin-wrapper">
      <h3 className="title">
        Sign in to <span style={{ color: "var(--theme" }}>ExpenZo</span>
      </h3>
      <form>
        <Input
          label="Email"
          state={email}
          setState={setEmail}
          placeholder={"Peter@xyz.com"}
          type="email"
        />
        <Input
          label="Password"
          state={password}
          setState={setpassword}
          placeholder={"Password"}
          type="password"
        />

        <Button
          text={loading ? "Loading..." : "Signin using email and password"}
          onClick={signinUsingEmail}
          disabled={loading}
        />
        <Linetext linetext={"OR"} />
        <Button
          blue={true}
          img={
            <img
              style={{ width: "1.2rem", height: "1.2rem", marginRight: "5px" }}
              src={googleIcon}
              alt="icon"
            />
          }
          onClick={googleAuth}
          text={loading ? "Loading" : "Continue with google"}
          disabled={loading}
        />
        <p>
          <span
            style={{ color: "blue", fontWeight: "400", cursor: "pointer" }}
            onClick={navigateSignup}
          >
            Click here{" "}
          </span>
          to create account.
        </p>
      </form>
    </div>
  );
}

export default Signin;
