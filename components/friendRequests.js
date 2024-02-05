import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";

export default function FriendRequests() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [friends, setFriends] = useState([]);

  const getFriendRequests = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
    const docRef = collection(
      db,
      `users/${user.uid}/allNotifications/${user.uid}/friendRequests`
    );

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setFriends(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return unsubscribe;
  };

  const acceptRequest = async (id) => {
    const docRef = doc(db, "users", id);
    const friendRef = doc(db, `users/${user.uid}/friends`, id);
    const checkRef = doc(db, `users/${id}/friends`, user.uid);
    const docSnap = await getDoc(docRef);

    console.log(docSnap);
    // await setDoc(friendRef, {
    //   id: id,
    //   username: docSnap.data().username,
    //   avatar: docSnap.data().avatar,
    // });
    // await setDoc(checkRef, {
    //   id: user.uid,
    //   username: user.displayName,
    //   avatar: user.photoURL,
    // });
    // await deleteDoc(
    //   doc(
    //     db,
    //     `users/${user.uid}/allNotifications/${user.uid}/friendRequests`,
    //     id
    //   )
    // );
    // await deleteDoc(
    //   doc(db, `users/${id}/allNotifications/${id}/sentRequests`, user.uid)
    // );
    // toast.success("Friend has been added!", {
    //   position: toast.POSITION.TOP_CENTER,
    //   autoClose: 1500,
    // });
  };
  const rejectRequest = async (id) => {
    await deleteDoc(
      doc(
        db,
        `users/${user.uid}/allNotifications/${user.uid}/friendRequests`,
        id
      )
    );
    toast.success(
      "Friend request rejected. Don't worry, they will not be notified",
      {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      }
    );
  };

  useEffect(() => {
    getFriendRequests();
  }, [user, loading]);
  return (
    <div className="my-8 sm:p-8 shadow-lg rounded-lg max-w-full mx-auto w-full bg-white p-1">
      {friends.length > 0 ? (
        friends.map((friendDetails) => {
          return (
            <div
              key={friendDetails.id}
              className="bg-white p-4 my-4 border-solid border-black-600 flex flex-row items-center border-b"
            >
              <img
                className="w-10 rounded-full"
                src={friendDetails.avatar}
                alt=""
              />
              <h2 className="ml-4">{friendDetails.username}</h2>
              <div className="flex gap-4 ml-auto">
                <button
                  className="font-medium sm:bg-cyan-500 text-white sm:py-2 sm:px-4 rounded-md text-sm ml-auto p-0 bg-transparent"
                  onClick={() => acceptRequest(friendDetails.id)}
                >
                  <p className="hidden sm:block">Accept</p>

                  <FaCheck className="text-emerald-500 block sm:hidden text-lg " />
                </button>
                <button
                  className="font-medium sm:bg-pink-500 text-white sm:py-2 sm:px-4 rounded-md text-sm ml-auto p-0 bg-transparent"
                  onClick={() => rejectRequest(friendDetails.id)}
                >
                  <p className="hidden sm:block">Reject</p>
                  <ImCross className="text-pink-500 block sm:hidden text-lg " />
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div>No requests yet</div>
      )}
    </div>
  );
}
