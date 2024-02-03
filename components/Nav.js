import Link from "next/link";
import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaSearch } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, docs, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
export default function Nav() {
  const [user, loading] = useAuthState(auth);
  const [currentUser, setCurrentUser] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const route = useRouter();
  useEffect(() => {
    const getUser = async () => {
      let data = [];
      if (loading) return;
      if (!user) return route.push("/auth/login");
      const docRef = doc(db, "users", user.uid);
      const dataSnap = await getDoc(docRef);
      data.push({ ...dataSnap.data() });
      setCurrentUser([...data]);
    };
    const getNotifications = async () => {
      if (loading) return;
      if (!user) return route.push("/auth/login");
      const friendRef = collection(
        db,
        `users/${user.uid}/allNotifications/${user.uid}/friendRequests`
      );
      const docRef = collection(
        db,
        `users/${user.uid}/allNotifications/${user.uid}/notifications`
      );
      const docSnap = await getDocs(docRef);
      const friendsnap = await getDocs(friendRef);
      let requestData = [];
      let commentsData = [];
      docSnap.docs.forEach((element) => {
        requestData.push({ ...element.data(), id: element.id });
      });
      friendsnap.docs.forEach((element) => {
        commentsData.push({ ...element.data(), id: element.id });
      });

      setNotifications([...requestData, ...commentsData]);
    };
    getUser();
    getNotifications();
  }, [user, loading]);
  useEffect(() => {
    const getNotifications = async () => {
      if (loading) return;
      if (!user) return route.push("/auth/login");
      const friendRef = collection(
        db,
        `users/${user.uid}/allNotifications/${user.uid}/friendRequests`
      );
      const docRef = collection(
        db,
        `users/${user.uid}/allNotifications/${user.uid}/notifications`
      );
      const docSnap = await getDocs(docRef);
      const friendsnap = await getDocs(friendRef);
      let requestData = [];
      let commentsData = [];
      docSnap.docs.forEach((element) => {
        requestData.push({ ...element.data(), id: element.id });
      });
      friendsnap.docs.forEach((element) => {
        commentsData.push({ ...element.data(), id: element.id });
      });

      setNotifications([...requestData, ...commentsData]);
    };

    getNotifications();
  }, [notifications]);

  return (
    <div className="flex justify-between items-center py-10">
      <Link href="/">
        <button className="text-lg font-medium">Diary.io</button>
      </Link>
      <div className="flex items-center gap-10">
        {!user && (
          <Link href="/auth/login">
            <button className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium ml-8">
              Join Now
            </button>
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-6">
            <Link
              href="/search/searchBar"
              className="font-medium py-2 px-4 text-sm"
            >
              <FaSearch />
            </Link>
            <Link
              href="/allnotifications"
              className="font-medium py-2 px-2 text-2xl relative"
            >
              <IoMdNotificationsOutline />
              <span className="text-xs absolute top-0 left-2/4 bg-black text-white rounded-full flex items-center justify-center w-5 h-5">
                {notifications.length}
              </span>
            </Link>
            <Link
              href="/createpost"
              className="font-medium bg-cyan-500 text-white py-2 px-2 rounded-lg text-sm"
            >
              Post
            </Link>

            {user.photoURL == null ? (
              currentUser &&
              currentUser.map((user) => (
                <div
                  key={user.user}
                  className="bg-white border-solid border-2 border-black-600 w-12 h-12 rounded-full flex items-center justify-center"
                >
                  <Link href="/dashboard">
                    <img
                      className="w-6/12 cursor-pointer"
                      src={user.avatar}
                      referrerPolicy="no-referrer"
                      alt=""
                    />
                  </Link>
                </div>
              ))
            ) : (
              <Link href="/dashboard">
                <img
                  className="w-12 rounded-full cursor-pointer"
                  src={user.photoURL}
                  referrerPolicy="no-referrer"
                  alt=""
                />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
