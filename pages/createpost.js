import { auth, db } from "../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

export default function CreatePost() {
  const [user, loading] = useAuthState(auth);
  const [post, setPost] = useState({ description: "" });
  const route = useRouter();
  const routeData = route.query;

  const submitPost = async (e) => {
    e.preventDefault();

    if (!post.description) {
      toast.error("Description Field empty 😅", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    if (post.description.length > 300) {
      toast.error("Description too long 😅", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      toast.success("Post has been edited 🚀", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return route.push("/");
    } else {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: docSnap.data().avatar,
        username: docSnap.data().username,
      });
      setPost({ description: "" });
      toast.success("Post has been made 🚀", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return route.push("/");
    }
  };

  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push("/auth/login");
    if (routeData.id) {
      setPost({ description: routeData.description, id: routeData.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    user && (
      <div className="my-20 px-4 py-12 sm:p-12 shadow-lg rounded-lg max-w-md mx-auto w-full bg-white">
        <form onSubmit={submitPost}>
          <h1 className="text-2xl font-bold">
            {post.hasOwnProperty("id") ? "Edit your post" : "Create a new post"}
          </h1>
          <div className="py-2">
            <h3 className="text-lg font-medium py-2">Description</h3>
            <textarea
              value={post.description}
              onChange={(e) =>
                setPost({ ...post, description: e.target.value })
              }
              className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm"
            ></textarea>
            <p
              className={`text-cyan-600 font-medium text-sm ${
                post.description.length > 300 ? "text-red-600" : ""
              }`}
            >
              {post.description.length}/300
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white font-medium p-2 m-2 rounded-lg text-s"
          >
            Submit
          </button>
        </form>
      </div>
    )
  );
}
