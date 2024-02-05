import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { FaComment } from "react-icons/fa";
import {
  collection,
  orderBy,
  onSnapshot,
  doc,
  query,
  where,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import Message from "../components/message";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import Link from "next/link";
import { format } from "date-fns";

export default function MyPosts() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  const getData = async () => {
    let data = [];

    if (loading) return;
    if (!user) return route.push("/auth/login");
    const collectionRef = collection(db, "posts");

    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      // snapshot.docs.forEach(async (element) => {
      //   const commentRef = collection(db, `posts/${element.id}/comments`);

      //   const querySnapshot = await getDocs(commentRef);

      //   querySnapshot.forEach((doc) => {
      //     data.push({ ...doc.data(), id: doc.id });
      //   });
      //   setComments([...data]);
      // });
    });

    return unsubscribe;
  };

  const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };
  useEffect(() => {
    getData();
  }, [user, loading]);
  return (
    <div className="my-20 p-2 sm:p-8 shadow-lg rounded-lg max-w-full mx-auto w-full bg-blue-200">
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <Message {...post} className={post.id}>
              <div className="flex items-end justify-between">
                <Link
                  href={{
                    pathname: "/post",
                    query: { value: post.id },
                  }}
                >
                  <button>
                    <FaComment className="text-lg" />
                  </button>
                </Link>
                <Link href={{ pathname: "/post", query: post }}>
                  <button className="text-emerald-600 flex flex-col items-center justify-center text-sm">
                    <AiFillEdit className="text-lg" /> Edit
                  </button>
                </Link>
                <button
                  className="text-pink-600 flex flex-col items-center justify-center text-sm"
                  onClick={() => deletePost(post.id)}
                >
                  <BsTrash2Fill className="text-lg" /> Delete
                </button>
              </div>
              <p className="w-full text-end mt-4 text-md">
                {format(
                  new Date(
                    post.timestamp.seconds * 1000 +
                      post.timestamp.nanoseconds / 1000000
                  ).toDateString(),
                  "MMM do"
                )}{" "}
                {new Date(
                  post.timestamp.seconds * 1000 +
                    post.timestamp.nanoseconds / 1000000
                ).toLocaleTimeString()}
              </p>
            </Message>
          </div>
        );
      })}
    </div>
  );
}
