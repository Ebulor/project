import { useRouter } from "next/router";
import {
  Timestamp,
  doc,
  onSnapshot,
  query,
  orderBy,
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import Message from "../components/message";
import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { BsTrash2Fill } from "react-icons/bs";

export default function Post() {
  const route = useRouter();
  const [post, setPost] = useState([]);
  const [user, loading] = useAuthState(auth);
  const [comment, setcomment] = useState("");
  const [allcomments, setAllcomments] = useState([]);
  const routeData = route.query;

  const submitComment = async () => {
    if (!user) return route.push("/auth/login");

    if (!comment) {
      toast.error("Don't leave an empty comment", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    const checkRef = doc(db, "posts", routeData.value);
    const docSnap = await getDoc(checkRef);
    const notificationRef = collection(
      db,
      `users/${docSnap.data().user}/allNotifications/${
        docSnap.data().user
      }/notifications`
    );

    await addDoc(notificationRef, {
      comment,
      postId: routeData.value,
      avatar: user.photoURL,
      username: user.displayName,
      timestamp: serverTimestamp(),
    });

    const commentRef = collection(db, `posts/${routeData.value}/comments`);
    await addDoc(commentRef, {
      comment,
      avatar: user.photoURL,
      userName: user.displayName,
      userId: user.uid,
      timestamp: Timestamp.now(),
    });
    setcomment("");
  };
  const getComments = async () => {
    const docRef = collection(db, `posts/${routeData.value}/comments`);
    const q = query(docRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllcomments(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });

    return unsubscribe;
  };
  const deleteComment = async (id) => {
    await deleteDoc(doc(db, `posts/${routeData.value}/comments`, id));
  };
  const getPost = async () => {
    if (loading) return;

    const checkRef = doc(db, "posts", routeData.value);
    const docSnap = await getDoc(checkRef);

    setPost([{ ...docSnap.data(), id: docSnap.id }]);
    post.forEach((element) => {
      if (element.user === user.uid) {
        console.log("same users");
      } else {
        console.log("different users");
      }
    });
  };
  useEffect(() => {
    getPost();
    getComments();
  }, [loading]);
  return (
    <div className="my-10 p-8 shadow-lg rounded-lg max-w-full mx-auto w-full ">
      {post.map((data) => {
        return (
          <div key={routeData.value}>
            <Message {...data}>
              <p className="w-full text-end mt-4 text-md">
                {format(
                  new Date(
                    data.timestamp.seconds * 1000 +
                      data.timestamp.nanoseconds / 1000000
                  ).toDateString(),
                  "MMM do"
                )}{" "}
                {new Date(
                  data.timestamp.seconds * 1000 +
                    data.timestamp.nanoseconds / 1000000
                ).toLocaleTimeString()}
              </p>
            </Message>{" "}
            <div className="my-4">
              <div className="flex">
                <input
                  className="bg-gray-800 w-full p-2 text-white text-sm"
                  onChange={(e) => setcomment(e.target.value)}
                  type="text"
                  value={comment}
                  placeholder="Leave a comment"
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
                        referrerPolicy="no-referrer"
                      />
                      <h2>{comment.userName}</h2>
                    </div>
                    <div>
                      <h2>{comment.comment}</h2>
                    </div>
                    <div className="flex justify-between py-4">
                      {data.user === user.uid || comment.userId === user.uid ? (
                        <button
                          className="text-pink-600 text-sm"
                          onClick={() => deleteComment(comment.id)}
                        >
                          <BsTrash2Fill className="text-2xl" />
                        </button>
                      ) : (
                        ""
                      )}
                      <p className="ml-auto">
                        {format(
                          new Date(
                            data.timestamp.seconds * 1000 +
                              data.timestamp.nanoseconds / 1000000
                          ).toDateString(),
                          "MMM do"
                        )}{" "}
                        {new Date(
                          data.timestamp.seconds * 1000 +
                            data.timestamp.nanoseconds / 1000000
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
