import { IoMdCloseCircleOutline } from "react-icons/io";
import FriendRequests from "./friendRequests";
import { useEffect, useState } from "react";
import { db, auth } from "../utils/firebase";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  setDoc,
  getDoc,
  query,
  getDocs,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";
import { useRouter } from "next/router";
export default function Notifications() {
  const [user, loading] = useAuthState(auth);
  const [notifications, setNotifications] = useState([]);
  const route = useRouter();
  const getNotifications = async () => {
    if (!user) {
      route.push("/auth/login");
      return;
    }
    if (loading) return;

    const docRef = collection(
      db,
      `users/${user.uid}/allNotifications/${user.uid}/notifications`
    );

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setNotifications(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });

    return unsubscribe;
  };
  const removeNotification = async (id) => {
    await deleteDoc(
      doc(
        db,
        `users/${user.uid}/allNotifications/${user.uid}/notifications/`,
        id
      )
    );
  };
  const removeAllNotifications = async () => {
    const docRef = query(
      collection(
        db,
        `users/${user.uid}/allNotifications/${user.uid}/notifications`
      )
    );

    const toDelete = await getDocs(docRef);

    toDelete.forEach((item) => {
      const ID = item.id;
      deleteDoc(
        doc(
          db,
          `users/${user.uid}/allNotifications/${user.uid}/notifications/`,
          ID
        )
      );
    });
  };
  useEffect(() => {
    getNotifications();
  }, [user, loading]);

  return (
    <div className="my-8">
      {notifications.length > 0 && (
        <button
          onClick={() => removeAllNotifications()}
          className="w-full text-end text-sm underline"
        >
          Clear all
        </button>
      )}
      {notifications.length > 0 ? (
        notifications.map((notification, index) => {
          return (
            <div
              key={index}
              className="bg-white p-4 my-4 border-solid shadow-lg border-black-600 rounded-lg flex flex-col "
            >
              <div className="flex items-center">
                <img
                  className="w-10 rounded-full"
                  src={notification.avatar}
                  alt=""
                />
                <h2 className="ml-4">
                  {notification.username}{" "}
                  <span className="text-sm">left you a comment</span>
                </h2>

                <IoMdCloseCircleOutline
                  onClick={() => removeNotification(notification.id)}
                  className="ml-auto text-xl  cursor-pointer"
                />
              </div>
              <div className="my-4">
                <p>{notification.comment}</p>
              </div>
              <div className="flex justify-between">
                <Link
                  href={{
                    pathname: "/post",
                    query: { value: notification.postId },
                  }}
                  className="underline"
                >
                  view post
                </Link>
                <p className="">
                  {new Date(
                    notification.timestamp.seconds * 1000 +
                      notification.timestamp.nanoseconds / 1000000
                  ).toDateString()}{" "}
                  {new Date(
                    notification.timestamp.seconds * 1000 +
                      notification.timestamp.nanoseconds / 1000000
                  ).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <div>No notifications yet</div>
      )}
    </div>
  );
}
