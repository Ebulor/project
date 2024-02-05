import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Link from "next/link";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);

  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  useEffect(() => {
    getData();
  }, [user, loading]);
  return (
    <div className="flex flex-col py-4 w-full bg-white p-0.5 sm:p-10 rounded-lg">
      <h1 className="text-2xl font-bold py-2">Dashboard</h1>
      <Link href="/myposts">
        <button className="text-lg font-medium py-2">
          {" "}
          <h1>My Posts</h1>
        </button>
      </Link>
      <Link href="/mypals">
        <button className="text-lg font-medium py-2">
          <h1>My Pals</h1>
        </button>
      </Link>
      <Link href="/allnotifications">
        <button className="text-lg font-medium py-2">Notifications</button>
      </Link>
      <Link href="/settings">
        <button className="text-lg font-medium py-2">Settings</button>
      </Link>
      <button
        className="font-medium text-white bg-gray-800 py-2 px-4 my-6 rounded-lg"
        onClick={() => auth.signOut()}
      >
        Sign out
      </button>
    </div>
  );
}
