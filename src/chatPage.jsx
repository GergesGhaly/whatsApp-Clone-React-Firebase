import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaSmile, FaArrowDown } from "react-icons/fa";
import { RiMenuFoldLine, RiMenuLine } from "react-icons/ri";
// Adding FaArrowDown icon
import EmojiPicker from "emoji-picker-react";
import background from "./assets/background.png";
import Message from "./Message";
import { db, auth } from "./Firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import WelcomeScreen from "./WelcomeScreen";
import BlockUserModel from "./BlockUserModel";

const ChatPage = ({
  selectedUser,
  handeltoggleMenu,
  isMenuActive,
}) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showModel, setShowModel] = useState(false); // New state to control scroll button
  const emojiPickerRef = useRef(null);
  const currentUser = auth.currentUser;
  const messagesEndRef = useRef(null); // Reference to the last message
  const messageContainerRef = useRef(null); // Reference to the message container

  useEffect(() => {
    if (selectedUser && currentUser) {
      const conversationId =
        currentUser.uid < selectedUser.uid
          ? `${currentUser.uid}_${selectedUser.uid}`
          : `${selectedUser.uid}_${currentUser.uid}`;

      const messagesRef = collection(
        db,
        "conversations",
        conversationId,
        "messages"
      );
      const q = query(messagesRef, orderBy("timestamp"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
        scrollToBottom(); // Scroll to the bottom on update
      });

      return () => unsubscribe();
    }
  }, [selectedUser, currentUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handelInputChang = (e) => {
    setMessageText(e.target.value);
  };

  const handleSendMessage = async () => {
    if (messageText.trim() === "") return;

    const conversationId =
      currentUser.uid < selectedUser.uid
        ? `${currentUser.uid}_${selectedUser.uid}`
        : `${selectedUser.uid}_${currentUser.uid}`;

    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages"
    );
    await addDoc(messagesRef, {
      text: messageText,
      senderId: currentUser.uid,
      receiverId: selectedUser.uid,
      timestamp: serverTimestamp(),
    });

    setMessageText("");
    setShowEmojiPicker(false);
  };

  const onEmojiClick = (event) => {
    setMessageText((prevInput) => prevInput + event.emoji);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // Function to scroll to the bottom of the page
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Logic to control showing or hiding the button
  const handleScroll = () => {
    const container = messageContainerRef.current;
    if (
      container.scrollHeight - container.scrollTop ===
      container.clientHeight
    ) {
      setShowScrollButton(false); // Hide the button when at the bottom of the messages
    } else {
      setShowScrollButton(true); // Show the button when scrolling up
    }
  };

  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <>
      {!selectedUser ? (
        <WelcomeScreen handeltoggleMenu={handeltoggleMenu} />
      ) : (
        <div className="relative flex flex-col h-screen bg-[#111B21]">
          <div
            className="absolute inset-0 bg-no-repeat bg-cover opacity-10 z-0"
            style={{ backgroundImage: `url(${background})` }}
          ></div>

          <div className="relative z-10 flex flex-col h-full">
            <header className="bg-[#202C33] w-full text-white p-4 flex justify-between items-center gap-4  shadow hover:bg-[#202C33] cursor-pointer transition-colors">
              <div className="flex gap-2 items-center">
                <img
                  src={selectedUser?.img || "https://via.placeholder.com/40"}
                  alt={selectedUser?.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h2 className="text-lg font-semibold">
                    {selectedUser?.name || "Select a user"}
                  </h2>
                  <p className="text-sm text-gray-500 w-full overflow-hidden text-nowrap">
                    {selectedUser?.email}
                  </p>
                </div>
              </div>
              {/* Block users button */}
              <div className="flex gap-6 items-center ">
                <button
                  onClick={() => setShowModel(true)}
                  className="text-gray-400"
                >
                  حظر
                </button>
                <div className="ml-auto  xs:block md:hidden ">
                  {/* //Toggle menu button */}

                  {!isMenuActive ? (
                    <button
                      className="text-white focus:outline-none flex  items-center"
                      onClick={() => handeltoggleMenu()}
                    >
                      <RiMenuLine size={24} />
                    </button>
                  ) : (
                    <button
                      className="text-white focus:outline-none flex  items-center"
                      onClick={() => handeltoggleMenu()}
                    >
                      <RiMenuFoldLine size={24} />
                    </button>
                  )}
                </div>
              </div>
            </header>

            <div
              className="flex-grow p-4 xs:px:[2rem] md:px-[4rem]  overflow-y-auto"
              ref={messageContainerRef} // Adding reference to the messages element
            >
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <Message
                    key={msg.id}
                    text={msg.text}
                    sender={
                      msg.senderId === currentUser.uid
                        ? "You"
                        : selectedUser.name
                    }
                    timestamp={msg.timestamp?.toDate().toLocaleTimeString()}
                    isOwnMessage={msg.senderId === currentUser.uid}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500">No messages yet</p>
              )}

              {/* Placeholder for the last message */}
              <div ref={messagesEndRef} />
              {/* Circular button to scroll down, visible only when scrolling up */}
            </div>
            {showScrollButton && (
              <button
                className="absloute w-12 h-12 flex justify-center items-center  bottom-20 left-2 p-3 bg-[#202C33] text-[#798287] rounded-full shadow-lg cursor-pointer transition"
                onClick={scrollToBottom}
              >
                <FaArrowDown size={24} />
              </button>
            )}

            <footer className="bg-[#202C33] w-full p-4 border-t flex items-center">
              <button
                className="p-2 text-blue-500"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <FaSmile size={24} />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={handelInputChang}
                onKeyDown={handleKeyDown}
                className="flex-grow mx-2 p-2 border text-white rounded-lg focus:outline-none border-none bg-[#2A3942]"
              />
              {showEmojiPicker && (
                <div className="absolute bottom-20 z-50" ref={emojiPickerRef}>
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
              <button className="p-2 text-blue-500" onClick={handleSendMessage}>
                <FaPaperPlane size={24} />
              </button>
            </footer>
          </div>
          {showModel && (
            <BlockUserModel
              selectedUser={selectedUser}
              setShowModel={setShowModel}
              currentUser={currentUser}
            />
          )}
        </div>
      )}
    </>
  );
};

export default ChatPage;
