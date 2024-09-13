import React, { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase"; // Make sure to import your Firebase setup
import UserMenu from "./UserMenu";
import ChatPage from "./ChatPage";

function App() {
  const [user, setUser] = useState(null); // State for storing the current user
  const [selectedUser, setSelectedUser] = useState(null); // State for storing the selected user
  const [isMenuActive, setIsMenuActive] = useState(false); // State to toggle the menu visibility
  const menuRef = useRef(null); // Reference for the user menu

  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update the user state when authentication state changes
    });

    return () => unsubscribe(); // Cleanup the subscription on component unmount
  }, []);

  useEffect(() => {
    // Add an event listener for clicks outside the menu
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuActive(false); // Close the menu if the click is outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Add the event listener
    return () => document.removeEventListener("mousedown", handleClickOutside); // Cleanup the event listener
  }, []);

  const handeltoggleMenu = () => {
    // Toggle the menu active state
    setIsMenuActive(!isMenuActive);
  };

  return (
    <div className="relative h-screen grid grid-cols-1 md:grid-cols-4">
      {/* Sidebar */}
      <div
        ref={menuRef} // Attach the reference here
        className={`bg-[#202C33] h-full transition-transform duration-300 transform fixed top-0 left-0 z-20 w-[85%] md:w-full md:relative md:col-span-1 ${
          isMenuActive ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <UserMenu
          setSelectedUser={setSelectedUser}
          selectedUser={selectedUser}
          setIsMenuActive={setIsMenuActive}
          handeltoggleMenu={handeltoggleMenu}
        />
      </div>

      {/* Chat page */}
      <div className="h-full md:col-span-3 relative">
        <ChatPage
          selectedUser={selectedUser}
          handeltoggleMenu={handeltoggleMenu}
          isMenuActive={isMenuActive}
          setIsMenuActive={setIsMenuActive}
        />
      </div>
    </div>
  );
}

export default App;
