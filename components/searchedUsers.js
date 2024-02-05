import { Children } from "react";
import { db, auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  doc,
  serverTimestamp,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SearchedUsers({
  children,
  avatar,
  username,
  searchedUser,
  isFriend,
  id,
  isUser,
}) {
  const [currentUser, loading] = useAuthState(auth);
  const route = useRouter();
  const [count, setCount] = useState(1);

  const sendFriendRequest = async (id) => {
    const docRef = doc(
      db,
      `users/${id}/allNotifications/${id}/friendRequests`,
      currentUser.uid
    );
    await setDoc(docRef, {
      id: currentUser.uid,
      avatar: currentUser.photoURL,
      username: currentUser.displayName,
      timestamp: serverTimestamp(),
    });

    const sentRef = doc(
      db,
      `users/${currentUser.uid}/allNotifications/${currentUser.uid}/sentRequests`,
      id
    );
    const userRef = doc(db, "users", id);
    const docSnap = await getDoc(userRef);
    await setDoc(sentRef, {
      id: id,
      avatar: docSnap.data().avatar,
      username: docSnap.data().username,
      timestamp: serverTimestamp(),
    });
    const userDoc = doc(
      db,
      `users/${currentUser.uid}/allNotifications`,
      currentUser.uid
    );

    toast.success("Friend request has been sent 🚀", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1500,
    });
  };
  useEffect(() => {}, [currentUser, loading]);
  return (
    <div className="bg-white p-4 my-4 border-solid border-2 border-black-600 rounded-lg">
      <div className="flex items-center gap-2">
        <img className="w-8 rounded-full cursor-pointer" src={avatar} />

        <h2>{username}</h2>
        {isUser ? (
          <Link className="ml-auto" href="/myposts">
            <button className="font-medium bg-cyan-500 text-white py-2 px-4 rounded-md text-sm ">
              view your posts
            </button>
          </Link>
        ) : isFriend ? (
          <Link
            className="ml-auto"
            href={{
              pathname: "/friendProfile",
              query: { value: id },
            }}
          >
            <button className="font-medium bg-cyan-500 text-white py-2 px-4 rounded-md text-sm ">
              view profile
            </button>
          </Link>
        ) : (
          <button
            onClick={() => sendFriendRequest(id)}
            className="font-medium bg-cyan-500 text-white py-2 px-4 rounded-md text-sm ml-auto"
          >
            Send friend request
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
