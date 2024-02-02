import { Children } from "react";

export default function Message({
  children,
  avatar,
  username,
  description,
  timestamp,
}) {
  return (
    <div className="bg-white p-6 rounded-lg my-8 shadow-lg">
      <div className="flex items-center gap-2">
        <img
          src={avatar}
          className="w-10 rounded-full"
          referrerPolicy="no-referrer"
        ></img>
        <h2>{username}</h2>
        <p className="ml-auto">
          {new Date(
            timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
          ).toDateString()}{" "}
          {new Date(
            timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
          ).toLocaleTimeString()}
        </p>
      </div>
      <div className="py-4">
        <p className="flex flex-wrap">{description}</p>
      </div>
      {children}
    </div>
  );
}
