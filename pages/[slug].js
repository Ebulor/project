import {
  Timestamp,
  arrayUnion,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  setDoc,
  collection,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import Message from "../components/message";
import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { BsTrash2Fill } from "react-icons/bs";

export default function Details({ post }) {
  const router = useRouter();
  // const routeData = router.query;
  // const [comment, setcomment] = useState("");
  // const [allcomments, setAllcomments] = useState([]);
  // const [currentUser, loading] = useAuthState(auth);

  // const submitComment = async () => {
  //   if (!auth.currentUser) return router.push("/auth/login");

  //   if (!comment) {
  //     toast.error("Don't leave an empty comment", {
  //       position: toast.POSITION.TOP_CENTER,
  //       autoClose: 1500,
  //     });
  //     return;
  //   }

  //   const notificationRef = collection(
  //     db,
  //     `users/${routeData.user}/allNotifications/${routeData.user}/notifications`
  //   );
  //   await addDoc(notificationRef, {
  //     comment,
  //     postId: routeData.id,
  //     username: auth.currentUser.displayName,
  //     avatar: auth.currentUser.photoURL,
  //     time: serverTimestamp(),
  //   });

  //   const commentRef = collection(db, `posts/${routeData.id}/comments`);
  //   await addDoc(commentRef, {
  //     comment,
  //     avatar: auth.currentUser.photoURL,
  //     userName: auth.currentUser.displayName,
  //     userId: auth.currentUser.uid,
  //     time: Timestamp.now(),
  //   });
  //   setcomment("");
  // };

  // const getComments = async () => {
  //   const docRef = collection(db, `posts/${routeData.id}/comments`);
  //   const q = query(docRef, orderBy("time", "desc"));
  //   const unsubscribe = onSnapshot(q, (snapshot) => {
  //     setAllcomments(
  //       snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  //     );
  //   });
  //   return unsubscribe;
  // };
  // const deleteComment = async (id) => {
  //   await deleteDoc(doc(db, `posts/${routeData.id}/comments`, id));
  // };

  // useEffect(() => {
  //   if (!router.isReady) return;
  //   getComments();
  // }, [router.isReady]);

  return (
    <div className="my-20 p-8 shadow-lg rounded-lg max-w-full mx-auto w-full ">
      <p>boo</p>
      {/* <Message {...routeData}></Message>
      <div className="my-4">
        <div className="flex">
          <input
            className="bg-gray-800 w-full p-2 text-white text-sm"
            onChange={(e) => setcomment(e.target.value)}
            type="text"
            value={comment}
            placeholder="Write a comment"
          />
          <button
            onClick={submitComment}
            className="bg-cyan-500 text-white py-2 px-4 text-sm"
          >
            Send
          </button>
        </div>
        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {allcomments?.map((comment) => (
            <div
              className="bg-white p-4 my-4 rounded-lg shadow-lg"
              key={comment.id}
            >
              <div className="flex items-center gap-2 mb-4 ">
                <img
                  className="w-10 rounded-full"
                  src={comment.avatar}
                  alt=""
                />
                <h2>{comment.userName}</h2>
              </div>
              <h2>{comment.comment}</h2>
              {routeData.user === currentUser.uid ||
              comment.userId === currentUser.uid ? (
                <button
                  className="text-pink-600 flex items-center justify-center gap-2 py-4 text-sm"
                  onClick={() => deleteComment(comment.id)}
                >
                  <BsTrash2Fill className="text-2xl" /> Delete
                </button>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
// const docRef = doc(db, "posts", routeData.slug);
// await updateDoc(docRef, {
//   comments: arrayUnion({
//     comment,
//     avatar: auth.currentUser.photoURL,
//     userName: auth.currentUser.displayName,
//     time: Timestamp.now(),
//   }),
// });
