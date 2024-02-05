import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { db, auth } from "../utils/firebase";
import SearchedUsers from "../components/searchedUsers";
import { useAuthState } from "react-firebase-hooks/auth";

export default function SearchUser() {
  const [searchInput, setSearchInput] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, loading] = useAuthState(auth);
  const [friendData, setFriendData] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const collectionRef = collection(db, "users");
      const q = query(collectionRef, orderBy("username"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setAllUsers(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      });
      return unsubscribe;
    };

    const getFriendData = async () => {
      if (loading) return;
      const docRef = collection(db, `users/${currentUser.uid}/friends`);
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        setFriendData(
          snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
      });

      return unsubscribe;
    };
    getUsers();

    getFriendData();
  }, [currentUser, loading]);

  useEffect(() => {
    if (searchInput.length < 1) {
      setSearchedUsers([]);

      return;
    } else {
      setSearchedUsers(
        allUsers.filter((user) =>
          user.username.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    }
  }, [searchInput, allUsers]);
  return (
    <section className="w-3/4 xs:w-max">
      <div className="search">
        <TextField
          id="outlined-search"
          variant="outlined"
          fullWidth
          label="Search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      <div className="searched-users">
        {searchedUsers.map((searchedUser) =>
          friendData.some(({ id }) => id === searchedUser.id) ? (
            <SearchedUsers
              {...searchedUser}
              key={searchedUser.id}
              isFriend={true}
              id={searchedUser.id}
            ></SearchedUsers>
          ) : searchedUser.username
              .toLowerCase()
              .includes(currentUser.displayName.toLowerCase()) ? (
            <SearchedUsers
              {...searchedUser}
              key={searchedUser.id}
              isUser={true}
              id={searchedUser.id}
            ></SearchedUsers>
          ) : (
            <SearchedUsers
              {...searchedUser}
              key={searchedUser.id}
              id={searchedUser.id}
            ></SearchedUsers>
          )
        )}
      </div>
    </section>
  );
}
{
  /* {searchedUsers.map((searchedUser) =>
          friendData.some(({ id }) => id === searchedUser.id) ? (
            <SearchedUsers
              {...searchedUser}
              key={searchedUser.id}
              isFriend={true}
              id={searchedUser.id}
            ></SearchedUsers>
          ) : (
            <SearchedUsers
              {...searchedUser}
              key={searchedUser.id}
              id={searchedUser.id}
            ></SearchedUsers>
          )
        )} */
}
