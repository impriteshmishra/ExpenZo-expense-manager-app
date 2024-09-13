import React, { useState } from "react";
import "./styleSignup.css";
import Input from "../Input/inputComp";
import Button from "../Button/Button";
import Linetext from "../linetext/linetext";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, provider } from "../../firebase";
import { createRoot } from "react-dom/client";
import googleIcon from "../../assets/google.png";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  function signupUsingEmail() {
    setLoading(true);
    if (name != "" && email != "" && password != "" && confirmpassword != "") {
      if (password == confirmpassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log(user);
            toast.success("Account created successfully.");
            setLoading(false);
            setName("");
            setEmail("");
            setpassword("");
            setConfirmPassword("");
            createDoc(user);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
            // ..
          });
      } else {
        toast.error("Password didn't match");
        setLoading(false);
      }
    } else {
      toast.error("All fields are mandatory.");
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
      navigate('/dashboard');
      toast.error("Doc already exits");
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
          toast.success("User authenticated.")
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
          toast.error(errorMessage);
          setLoading(false);
          // ...
        });
    } catch (error) {
      toast.error(error);
      setLoading(false);
    }
  }
  const navigateSignin = () => {
    navigate("/Signin");
  };

  return (
    <div className="signup-wrapper">
      <h3 className="title">
        Sign Up on <span style={{ color: "var(--theme" }}>ExpenZo</span>
      </h3>
      <form>
        <Input
          label="Full Name"
          state={name}
          setState={setName}
          placeholder={"Peter Parker"}
          type="text"
        />
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
        <Input
          label="Confirm Password"
          state={confirmpassword}
          setState={setConfirmPassword}
          placeholder={"Confirm Password"}
          type="password"
        />
        <Button
          text={loading ? "Loading..." : "Signup using email and password"}
          onClick={signupUsingEmail}
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
          text={loading ? "Loading" : "Signup using google"}
          disabled={loading}
        />
        <p>
          Already have an account?{" "}
          <span
            onClick={navigateSignin}
            style={{ color: "blue", fontWeight: "400", cursor: "pointer" }}
          >
            Sign in
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signup;
