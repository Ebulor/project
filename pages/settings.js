import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SentRequets from "../components/sentRequests";
import {
  doc,
  setDoc,
  getDoc,
  query,
  updateDoc,
  collection,
  getDocs,
  where,
  deleteDoc,
} from "firebase/firestore";

export default function Settings() {
  const route = useRouter();

  const [user, loading] = useAuthState(auth);
  const [userName, setUserName] = useState("");
  const getUser = async () => {
    if (loading) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    setUserName(userData.data().username);
  };
  useEffect(() => {
    if (loading) return;
    if (!user) route.push("/auth/login");
    getUser();
  }, [user, loading]);

  return (
    user && (
      <div className="my-8 p-8 shadow-lg rounded-lg max-w-full mx-auto w-full bg-white">
        <h2 className="font-bold">Username : {userName}</h2>
        <SentRequets />
      </div>
    )
  );
}
