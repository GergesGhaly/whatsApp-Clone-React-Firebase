import React, { useState, useEffect } from "react";
import LogOutBtn from "./LogOutBtn";
import { db, auth } from "./Firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";
import User from "./User";

const UserMenu = ({ setSelectedUser, setIsMenuActive }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const currentUser = auth.currentUser;

        if (currentUser) {
          // Fetch current user data, including the blocked users list
          const currentUserRef = doc(db, "users", currentUser.uid);
          const currentUserDoc = await getDoc(currentUserRef);
          const currentUserData = currentUserDoc.data();
          const blockedUsers = currentUserData?.blockedUsers || [];

          // Fetch users excluding the current user and blocked users
          const q = query(usersCollection, where("uid", "!=", currentUser.uid));
          const querySnapshot = await getDocs(q);

          // Filter out blocked users
          const userList = querySnapshot.docs
            .map((doc) => doc.data())
            .filter((user) => !blockedUsers.includes(user.uid)); // Exclude blocked users

          // Check if the other users have blocked the current user
          const userWithLastMessages = await Promise.all(
            userList.map(async (user) => {
              const blockedByOtherUserRef = doc(db, "users", user.uid);
              const blockedByOtherUserDoc = await getDoc(blockedByOtherUserRef);
              const blockedByOtherUserData = blockedByOtherUserDoc.data();
              const blockedByOtherUser =
                blockedByOtherUserData?.blockedUsers || [];

              // Exclude if the other user has blocked the current user
              if (blockedByOtherUser.includes(currentUser.uid)) {
                return null; // If blocked, exclude the user
              }

              // Fetch the last message
              const conversationId =
                currentUser.uid < user.uid
                  ? `${currentUser.uid}_${user.uid}`
                  : `${user.uid}_${currentUser.uid}`;

              const messagesRef = collection(
                db,
                "conversations",
                conversationId,
                "messages"
              );
              const q = query(
                messagesRef,
                orderBy("timestamp", "desc"),
                limit(1)
              );
              const snapshot = await getDocs(q);

              const lastMessage =
                snapshot.docs.map((doc) => doc.data())[0] || null;
              return { ...user, lastMessage };
            })
          );

          setUsers(userWithLastMessages.filter(Boolean)); // Remove null values
        } else {
          console.error("No user is currently authenticated");
        }
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsMenuActive(false);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex justify-center items-center w-100 flex-col h-screen bg-[#111B21] text-[#E9EDEF]">
      <header className="flex justify-between w-full text-white p-4">
        <h1 className="text-xl font-semibold">Chats</h1>
        <LogOutBtn />
      </header>

      <div className="p-4 w-full bg-[#111B21]">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none border-none bg-[#202C33]"
        />
      </div>

      <div className="flex-grow w-full overflow-y-auto pt-2">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <User
              key={user.uid}
              user={user}
              handleUserSelect={handleUserSelect}
            />
            // <div
            //   key={user.uid}
            //   className="flex items-center w-full overflow-hidden gap-3 p-2 mb-1 shadow hover:bg-[#202C33] cursor-pointer transition-colors"
            //   onClick={() => handleUserSelect(user)}
            // >
            //   <img
            //     src={user.img}
            //     alt={user.name}
            //     className="w-12 h-12 rounded-full"
            //   />
            //   <div>
            //     <h2 className="text-lg font-semibold">{user.name}</h2>
            //     <p className="text-sm text-gray-500 w-full overflow-hidden text-nowrap">
            //       {user.lastMessage
            //         ? `${user.lastMessage.text}`
            //         : "No messages"}
            //     </p>
            //   </div>
            // </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No users found</p>
        )}
      </div>
    </div>
  );
};

export default UserMenu;
