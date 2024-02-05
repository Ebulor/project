import { FcGoogle } from "react-icons/fc";
import { MdOutlineEmail } from "react-icons/md";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import { Formik } from "formik";
import * as Yup from "yup";
import { doc, setDoc, getDoc, query } from "firebase/firestore";
import { useState } from "react";

export default function Login() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const googleProvider = new GoogleAuthProvider();
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [avatar, setAvatar] = useState("");
  const [validUserName, setValidUsername] = useState(true);
  //google login
  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const docRef = doc(db, "users", result.user.uid);
      const dataSnap = await getDoc(docRef);
      if (dataSnap.exists()) {
        route.push("/");
      } else {
        route.push(
          {
            pathname: route.pathname,
            query: { ...route.query, value: "sign_up" },
          },
          { shallow: true }
        );
        setUserId(result.user.uid);
        setAvatar(result.user.photoURL);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const authenticateGoogleUsername = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "usernames", userName);
    const dataSnap = await getDoc(docRef);
    if (userName === "" || dataSnap.exists()) {
      setValidUsername(false);
      return;
    } else {
      setValidUsername(true);
      await setDoc(doc(db, "users", userId), {
        user: userId,
        avatar: avatar,
        username: userName,
      });
      setDoc(doc(db, "usernames", userName), {
        id: userId,
      });
      route.push("/");
    }
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async ({ email, password }, { setFieldError }) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        route.push("/");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/wrong-password") {
          setFieldError("password", "This password is incorrect");
        }

        if (errorCode === "auth/user-not-found") {
          setFieldError("email", "User does not exist");
        }
      });
  };

  return (
    <div className="modal-container shadow-xl fixed p-8 text-gray-700 rounded-lg overflow-y-auto top-24 bottom-0 bg-white">
      <div className="modal-content w-96 xs:w-fit">
        <div
          className={`${route.query.value === "sign_up" ? "flex" : "hidden"}`}
        >
          <form className="w-full">
            <h1 className="text-sm ">
              Create a username to finish setting up your account
            </h1>
            <div className="my-4">
              <TextField
                id="googleUsername"
                variant="outlined"
                fullWidth
                label="username"
                onChange={(e) => setUserName(e.target.value)}
              />

              <span className="text-xs text-red-500 my-2">
                {userName === ""
                  ? "Username cannot be empty"
                  : validUserName
                  ? ""
                  : " This username is already taken"}
              </span>
            </div>
            <button
              className="text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4 gap-2"
              onClick={(e) => authenticateGoogleUsername(e)}
            >
              <FcGoogle className="text-2xl" />
              Finish login
            </button>
          </form>
        </div>
        <div
          className={`${route.query.value === "sign_up" ? "hidden" : "block"}`}
        >
          <h2 className="text-2xl font-medium text-center">Sign in</h2>
          <div className="text-center my-4">
            Do&apos;nt have an account?
            <Link href="/auth/signUp" className="underline">
              Sign Up
            </Link>
          </div>
          <div className="pt-4">
            <Formik
              initialValues={{
                email: "",
                password: "",
                username: "",
              }}
              onSubmit={(values, errors) => {
                handleSubmit(values, errors);
              }}
              validationSchema={validationSchema}
            >
              {({
                values,
                errors,
                touched,
                handleSubmit,
                handleChange,
                handleBlur,
              }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <div className="my-4">
                      <TextField
                        id="loginEmail"
                        variant="outlined"
                        fullWidth
                        label="Email"
                        value={values.email}
                        onChange={handleChange("email")}
                        onBlur={handleBlur("email")}
                      />

                      <div className="text-xs text-red-500 my-2">
                        {touched.email && errors.email}
                      </div>
                    </div>
                    <div className="my-4">
                      <TextField
                        id="loginPassword"
                        variant="outlined"
                        fullWidth
                        label="Password"
                        value={values.password}
                        onChange={handleChange("password")}
                        onBlur={handleBlur("password")}
                      />
                      <div className="text-xs text-red-500 my-2">
                        {touched.password && errors.password}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="text-white bg-gray-700 w-full text-center font-medium rounded-lg flex align-middle p-4 gap-2 my-4 flex items-center justify-center"
                    >
                      Log in
                    </button>
                  </form>
                );
              }}
            </Formik>
            <h3 className="py-4">Sign in with one of the providers</h3>

            <button
              onClick={GoogleLogin}
              className="text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4 gap-2"
            >
              <FcGoogle className="text-2xl" />
              Log in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
