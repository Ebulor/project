// import TextField from "@mui/material/TextField";
// import { Formik } from "formik";
// import * as Yup from "yup";
// import {
//   doc,
//   setDoc,
//   getDoc,
//   query,
//   updateDoc,
//   collection,
//   getDocs,
//   where,
//   deleteDoc,
// } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth, db } from "../utils/firebase";
// import { toast } from "react-toastify";

// export default function EditUser() {
//   const [user, loading] = useAuthState(auth);
//   const [userName, setUserName] = useState("");
//   let success = false;
//   const getUser = async () => {
//     if (loading) return;
//     const userRef = doc(db, "users", user.uid);
//     const userData = await getDoc(userRef);
//     setUserName(userData.data().username);
//     const postRef = collection(db, "posts");
//     const getAllPosts = await getDocs(postRef);

//     getAllPosts.forEach(async (element) => {
//       const individualComments = collection(
//         db,
//         `posts/${element.ref}/comments`
//       );
//       const k = query(individualComments, where("userId", "==", user.uid));
//       const getComments = await getDocs(k);
//       console.log(getComments);
//     });
//   };

//   const validationSchema = Yup.object().shape({
//     username: Yup.string()
//       .required("Username is required")
//       .min(3, "username too short! Must be at least 3 characters.")
//       .max(15, "username too long! Must be less than 15 characters."),
//   });

//   const handleSubmit = async ({ username }, { setFieldError, resetForm }) => {
//     const userRef = doc(db, "users", user.uid);
//     const userSnap = await getDoc(userRef);
//     const usernameRef = doc(db, "usernames", username);
//     const dataSnap = await getDoc(usernameRef);
//     const postRef = collection(db, "posts");

//     const q = query(postRef, where("user", "==", user.uid));
//     const usernameCollection = collection(db, "usernames");
//     const k = query(usernameCollection, where("id", "==", user.uid));
//     const name = await getDocs(k);
//     const getPersonalPosts = await getDocs(q);
//     const getAllPosts = await getDocs(postRef);
//     console.log(getAllPosts);

//     if (dataSnap.exists()) {
//       setTimeout(() => {
//         setFieldError(
//           "username",
//           "This username is already taken, please try another one"
//         );
//       }, 1000);
//     } else {
//       name.forEach(async (doc) => {
//         await deleteDoc(doc.ref);
//       });
//       await updateDoc(userRef, {
//         username: username,
//       });

//       setDoc(doc(db, "usernames", username), {
//         id: user.uid,
//       });

//       getPersonalPosts.forEach(async (doc) => {
//         await updateDoc(doc.ref, {
//           username: username,
//         });
//       });
//       setUserName(username);
//       toast.success("Username has been edited 🚀", {
//         position: toast.POSITION.TOP_CENTER,
//         autoClose: 1500,
//       });
//       resetForm();
//     }
//   };

//   useEffect(() => {
//     getUser();
//   }, [user, loading]);

//   return (
//     <div>
//       <div>Current username : {userName}</div>
//       <Formik
//         initialValues={{
//           username: "",
//         }}
//         onSubmit={(values, errors) => {
//           handleSubmit(values, errors);
//         }}
//         validationSchema={validationSchema}
//       >
//         {({
//           values,
//           errors,
//           touched,
//           handleSubmit,
//           handleChange,
//           handleBlur,
//           resetForm,
//         }) => {
//           return (
//             <form
//               onSubmit={handleSubmit}
//               className="sm:flex sm:justify-between sm:items-start "
//             >
//               <div className="sm:my-4 ">
//                 <TextField
//                   id="editusername"
//                   variant="outlined"
//                   fullWidth
//                   label="Username"
//                   value={values.username}
//                   onChange={handleChange("username")}
//                   onBlur={handleBlur("username")}
//                 />

//                 <div className="text-xs text-red-500 my-2">
//                   {touched.username && errors.username}
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="text-white bg-gray-700 text-center w-full sm:w-max font-medium rounded-lg flex align-middle p-4 flex my-4"
//               >
//                 Change username
//               </button>
//               {touched.username && (
//                 <button
//                   className="text-white bg-gray-700 text-center w-full sm:w-max flex align-middle p-4 font-medium rounded-lg flex my-4 "
//                   type="reset"
//                   onClick={resetForm}
//                 >
//                   Cancel
//                 </button>
//               )}
//             </form>
//           );
//         }}
//       </Formik>
//     </div>
//   );
// }

//for editing username
