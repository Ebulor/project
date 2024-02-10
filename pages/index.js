import Message from "../components/message";
import { db, auth } from "../utils/firebase";
import { useEffect, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  where,
  getDocs,
} from "firebase/firestore";
import Link from "next/link";
import { FaComment } from "react-icons/fa";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { format } from "date-fns";
export default function Home() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [allPosts, setAllPosts] = useState([]);
  const [comments, setcomments] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      let data = [];

      if (loading) return;
      if (!user) return route.push("/auth/login");
      const docRef = collection(db, `users/${user.uid}/friends`);
      const collectionRef = collection(db, "posts");

      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        setFriends(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

        snapshot.docs.forEach(async (element) => {
          const q = query(
            collectionRef,
            where("user", "==", element.id),
            orderBy("timestamp", "desc")
          );

          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            data.push({ ...doc.data(), id: doc.id });
          });
        });
        const getPersonal = async () => {
          if (loading) return;
          let personalData = [];
          const collectionRef = collection(db, "posts");
          const k = query(
            collectionRef,
            where("user", "==", user.uid),
            orderBy("timestamp", "desc")
          );
          const personalSnapshot = await getDocs(k);
          personalSnapshot.forEach((doc) => {
            personalData.push({ ...doc.data(), id: doc.id });
          });
          setAllPosts([...personalData, ...data]);
        };
        getPersonal();

        return unsubscribe;
      });
    };

    getPosts();
  }, [user, loading]);

  return (
    user && (
      <div className="my-10 p-8 shadow-lg rounded-lg max-w-full mx-auto w-full bg-white">
        {allPosts.length > 0 ? (
          allPosts.map((post) => (
            <div key={post.id}>
              <Message {...post} userID={post.user}>
                <div className="flex justify-between items-end">
                  <Link
                    href={{
                      pathname: "/post",
                      query: { value: post.id },
                    }}
                  >
                    <button>
                      <FaComment className="text-lg" />
                    </button>
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
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg sm:p-8 flex flex-col font-roboto p-0.5">
            <h1 className="text-2xl text-center font-extrabold leading-10">
              This is a safe space, you can share your thoughts!
            </h1>

            <div className="flex flex-col sm:w-6/12 items-center justify-center self-center mt-4 font-satisfy w-fit">
              <Link
                href="/post"
                className="font-medium bg-cyan-500 text-white my-5 py-2 px-4 rounded-lg text-center"
              >
                create your first post!
              </Link>
              <Link
                href="/search/searchBar"
                className="font-medium bg-cyan-500 text-white my-5 py-2 px-4 rounded-lg "
              >
                Add a friend!
              </Link>
            </div>
          </div>
        )}
      </div>
    )
  );
}
