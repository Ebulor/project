import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db, auth } from "../utils/firebase";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

export default function SentRequets() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [requests, setRequests] = useState([]);

  const getSentRequests = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
    const docRef = collection(
      db,
      `users/${user.uid}/allNotifications/${user.uid}/sentRequests`
    );

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setRequests(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return unsubscribe;
  };

  const revokeRequest = async (id) => {
    await deleteDoc(
      doc(db, `users/${id}/allNotifications/${id}/friendRequests`, user.uid)
    );
    await deleteDoc(
      doc(db, `users/${user.uid}/allNotifications/${user.uid}/sentRequests`, id)
    );
    toast.success("Friend request has been revoked", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1500,
    });
  };

  useEffect(() => {
    getSentRequests();
  }, [user, loading]);
  return (
    <div className="my-8 p-8 shadow-lg rounded-lg max-w-full mx-auto w-full bg-white">
      <div>
        <h1 className="mb-8 font-bold">Sent friend requests</h1>
        {requests.length > 0 ? (
          requests.map((friendDetails) => {
            return (
              <div
                key={friendDetails.id}
                className="bg-white my-4 border-solid border-black-600 flex border-b py-4 items-center"
              >
                {" "}
                <img
                  className="w-10 rounded-full"
                  src={friendDetails.avatar}
                  alt=""
                />
                <p className="px-2 text-md">
                  You sent {friendDetails.username} a friend request
                </p>
                <button
                  className="font-medium bg-pink-500 text-white py-2 px-4 rounded-md text-sm ml-auto"
                  onClick={() => revokeRequest(friendDetails.id)}
                >
                  Revoke
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-sm">
            When you send a friend request it will appear here
          </p>
        )}
      </div>
    </div>
  );
}
