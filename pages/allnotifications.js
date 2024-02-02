import { useEffect, useState } from "react";
import Tabs from "../components/tab";
import FriendRequests from "../components/friendRequests";
import Notifications from "../components/notifications";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../utils/firebase";

export default function allNotifications() {
  let check = true;
  const [count, setCount] = useState([]);

  const route = useRouter();
  if (route.query.value === "notifications" || route.query.value === "")
    check = true;
  else if (route.query.value === "friendRequests") {
    check = false;
  }

  return (
    <section className="my-20 p-8 shadow-lg rounded-lg max-w-full mx-auto w-full bg-white">
      <Tabs></Tabs>
      <div>
        {check ? (
          <Notifications count={setCount} />
        ) : (
          <FriendRequests count={setCount} />
        )}
      </div>
    </section>
  );
}
