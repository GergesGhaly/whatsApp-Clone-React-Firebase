import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import { auth } from "./Firebase.js";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const db = getFirestore();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      navigate("/main"); // Navigate to the main page after successful login

      // Check if the user already exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If the user doesn't exist, add them to Firestore with uid
        await setDoc(userDocRef, {
          uid: user.uid, // Add uid here
          name: user.displayName,
          email: user.email,
          img: user.photoURL,
        });
        console.log("User added to Firestore:", user.displayName);
      } else {
        console.log("User already exists in Firestore");
      }

      console.log("User signed in with Google:", user);
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  return (
    <div className="flex relative justify-center h-screen">
      <div className="bg-[#0CA886] h-40 w-full p-8 text-white font-bold">
        <header className="flex gap-2 items-center justify-start h-12 ">
          <img
            className="w-ful h-full"
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt=""
          />
          <h1>whatsapp web</h1>
        </header>
      </div>
      <div className="bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2 text-[#404950]">Sign In</h1>
        <h6 className="text-l font-normal mb-6 text=[#4aa010]">
          Log in to WhatsApp using your Google account
        </h6>
        <button
          className="flex items-center justify-center w-full font-bold p-3 bg-[#008169] text-white rounded-lg"
          onClick={signInWithGoogle}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
