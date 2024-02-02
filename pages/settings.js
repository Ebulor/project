import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SentRequets from "../components/sentRequests";

export default function Settings() {
  return (
    <div className="my-8 p-8 shadow-lg rounded-lg max-w-full mx-auto w-full bg-white">
      <SentRequets />
    </div>
  );
}
