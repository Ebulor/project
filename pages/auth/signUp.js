import { FcGoogle } from "react-icons/fc";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc, query } from "firebase/firestore";
import { auth, db } from "../../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import { Formik } from "formik";
import * as Yup from "yup";

export default function SignUp() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const googleProvider = new GoogleAuthProvider();
  const [userName, setUserName] = useState("");
  const [validUserName, setValidUsername] = useState(true);
  let isAvailableUsername = true;
  let alreadyUser = true;
  let value;

  //google sign up
  const authenticateGoogleUsername = () => {
    route.push(
      {
        pathname: route.pathname,
        query: { ...route.query, value: "sign_up" },
      },
      { shallow: true }
    );
  };
  const GoogleSignUp = async (e) => {
    e.preventDefault();
    try {
      if (userName === "" || validUserName == false) {
        return;
      } else {
        const result = await signInWithPopup(auth, googleProvider);

        await setDoc(doc(db, "users", result.user.uid), {
          user: result.user.uid,
          avatar: result.user.photoURL,
          username: userName,
        });
        setDoc(doc(db, "usernames", userName), {
          id: result.user.uid,
        });
        route.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserName = async (e) => {
    setUserName(e.target.value);
    if (e.target.value === "") {
      return;
    } else {
      const docRef = doc(db, "usernames", e.target.value);
      const dataSnap = await getDoc(docRef);
      if (dataSnap.exists()) {
        setValidUsername(false);
      } else {
        setValidUsername(true);
      }
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password too short! Must be at least 6 characters."),
    username: Yup.string()
      .required("Username is required")
      .min(3, "username too short! Must be at least 6 characters.")
      .max(15, "username too long! Must be less than 15 characters."),
  });

  const handleSubmit = async (
    { email, password, username },
    { setFieldError }
  ) => {
    const docRef = doc(db, "usernames", username);
    const dataSnap = await getDoc(docRef);
    if (dataSnap.exists()) {
      isAvailableUsername = false;
    } else {
      isAvailableUsername = true;
    }
    await fetchSignInMethodsForEmail(auth, email)
      .then((SignInMethods) => {
        if (SignInMethods.length) {
          alreadyUser = false;
          return;
        } else {
          alreadyUser = true;
          if (alreadyUser == true && isAvailableUsername == true) {
            createUserWithEmailAndPassword(auth, email, password).then(
              (userCredential) => {
                // Signed in
                const user = userCredential.user;
                setDoc(doc(db, "users", user.uid), {
                  user: user.uid,
                  avatar:
                    "https://upload.wikimedia.org/wikipedia/commons/5/59/User-avatar.svg",
                  username: username,
                });
                setDoc(docRef, {
                  id: user.uid,
                });

                route.push("/");
              }
            );
          }
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    setTimeout(() => {
      if (isAvailableUsername == false)
        setFieldError(
          "username",
          "This username is already taken, please try another one"
        );
      if (alreadyUser == false)
        setFieldError("email", "A user with this email already exists");
    }, 1000);
  };

  useEffect(() => {
    if (user) {
      route.push("/");
    } else {
      console.log();
    }
  }, [user, loading]);

  return (
    <div className="modal-container shadow-xl fixed p-8 text-gray-700 rounded-lg overflow-y-auto top-24 bottom-0 bg-white">
      <div className="modal-content w-96">
        <div
          className={`${route.query.value === "sign_up" ? "flex" : "hidden"}`}
        >
          <form className="w-full">
            <h1 className="text-2xl font-bold">Create a username</h1>
            <div className="my-4">
              <TextField
                id="googleUsername"
                variant="outlined"
                fullWidth
                label="username"
                onChange={(e) => handleUserName(e)}
              />

              <span className="text-xs text-red-500 my-2">
                {userName === ""
                  ? "Username cannot be empty"
                  : validUserName
                  ? ""
                  : userName + " is already taken"}
              </span>
            </div>
            <button
              className="text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4 gap-2"
              onClick={(e) => GoogleSignUp(e)}
            >
              <FcGoogle className="text-2xl" />
              Finish sign up
            </button>
          </form>
        </div>
        <div
          className={`${route.query.value === "sign_up" ? "hidden" : "block"}`}
        >
          <h2 className="text-2xl font-medium text-center">
            Create an account
          </h2>
          <div className="text-center my-4">
            Already have an account?
            <Link href="/auth/login" className="underline">
              Log in
            </Link>
          </div>
          <div className="py-4">
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
                        id="email"
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
                        id="password"
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
                    <div className="my-4">
                      <TextField
                        id="userName"
                        variant="outlined"
                        fullWidth
                        label="Username"
                        value={values.username}
                        onChange={handleChange("username")}
                        onBlur={handleBlur("username")}
                      />
                      <div className="text-xs text-red-500 my-2">
                        {touched.username && errors.username}
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="text-white bg-gray-700 w-full text-center font-medium rounded-lg flex align-middle p-4 gap-2 my-4 flex items-center justify-center"
                    >
                      Create an account
                    </button>
                  </form>
                );
              }}
            </Formik>
            <h3 className="py-4">Or sign up with one of the providers</h3>
            <div className="flex flex-col justify-between py-4 content-between">
              <button
                onClick={authenticateGoogleUsername}
                className="text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4 gap-2"
              >
                <FcGoogle className="text-2xl" />
                Sign up with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
