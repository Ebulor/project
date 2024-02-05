import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { BsTrash2Fill } from "react-icons/bs";
import Link from "next/link";
import { toast } from "react-toastify";

export default function MyPals() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [friends, setFriends] = useState([]);
  const getFriends = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
    const docRef = collection(db, `users/${user.uid}/friends`);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setFriends(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return unsubscribe;
  };

  const removeFriend = async (id) => {
    await deleteDoc(doc(db, `users/${user.uid}/friends/`, id));
    await deleteDoc(doc(db, `users/${id}/friends/`, user.uid));

    toast.success("Friend has been removed", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1500,
    });
  };

  useEffect(() => {
    getFriends();
  }, [user, loading]);
  return (
    <div className="my-10 p-8 shadow-lg rounded-lg max-w-full mx-auto w-full bg-blue-200">
      {friends.length > 0 ? (
        friends.map((friendDetails) => {
          return (
            <div
              key={friendDetails.id}
              className="bg-white p-4 my-4 border-solid shadow-lg border-black-600 rounded-lg flex flex-row items-center flex-wrap sm:flex-nowrap "
            >
              <img
                className="w-10 rounded-full"
                src={friendDetails.avatar}
                alt=""
              />
              <h2 className="ml-4">{friendDetails.username}</h2>
              <div className="flex gap-4 ml-auto w-full justify-between py-4 sm:w-max">
                <Link
                  href={{
                    pathname: "/friendProfile",
                    query: { value: friendDetails.id },
                  }}
                  className="font-medium bg-cyan-500 text-white py-2 px-4 rounded-lg text-sm"
                >
                  View profile
                </Link>
                <button
                  className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm"
                  onClick={() => removeFriend(friendDetails.id)}
                >
                  <p className="hidden sm:block">Remove friend</p>
                  <BsTrash2Fill className="text-2xl" />
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div>No friends yet</div>
      )}
    </div>
  );
}
// setFeed(allPosts.filter((post) => allPosts.includes(post.id)));
