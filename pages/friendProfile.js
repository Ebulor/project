import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaComment } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  collection,
  doc,
  where,
  onSnapshot,
  query,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import Message from "../components/message";
import { format } from "date-fns";

export default function FriendPofile() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const routeData = router.query;
  const [friendsPosts, setFriendsPosts] = useState([]);
  const [friendData, setFriendData] = useState([]);

  const removeFriend = async (id) => {
    await deleteDoc(doc(db, `users/${user.uid}/friends/`, id));

    toast.success("Friend has been removed", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1500,
    });
    return router.push("/");
  };
  const getFriendData = async () => {
    if (loading) return;

    const friendRef = doc(db, "users", routeData.value);
    const docSnap = await getDoc(friendRef);

    setFriendData([{ ...docSnap.data(), id: docSnap.id }]);
  };
  useEffect(() => {
    if (loading) return;
    getFriendData();
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", routeData.value));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFriendsPosts(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    return unsubscribe;
  }, [routeData.id, user, loading]);
  return (
    <div className="my-20 p-6 sm:p-8 shadow-lg rounded-lg max-w-full mx-auto w-full bg-white">
      <div>
        {friendData.map((data, index) => {
          return (
            <div key={index} className="flex flex-row items-center ">
              <img src={data.avatar} className="w-10 rounded-full"></img>
              <h2 className="ml-2">{data.username}</h2>
              <button
                className="font-medium bg-pink-500 text-white py-2 px-4 rounded-mg text-sm ml-auto"
                onClick={() => removeFriend(data.id)}
              >
                Remove friend
              </button>
            </div>
          );
        })}

        <div className="posts mt-8">
          {friendsPosts.map((post, index) => {
            return (
              <Message {...post} key={index}>
                <div className="flex">
                  <Link
                    href={{
                      pathname: "/post",
                      query: { value: post.id },
                    }}
                  >
                    <FaComment className="text-lg" />
                  </Link>
                  <p className="ml-auto text-sm sm:text-md">
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
                </div>
              </Message>
            );
          })}
        </div>
      </div>
    </div>
  );
}
