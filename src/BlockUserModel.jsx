import React, { useState } from "react";
import { db } from "./Firebase"; 
import { updateDoc, doc, arrayUnion } from "firebase/firestore"; 

const BlockUserModel = ({ setShowModel, currentUser, selectedUser }) => {
  const [successMessage, setSuccessMessage] = useState(""); // حالة لرسالة النجاح

  async function blockUser(currentUserId, userIdToBlock) {
    try {
      // select current User data 
      const userRef = doc(db, "users", currentUserId);

      // add blocked user id to current user data
      await updateDoc(userRef, {
        blockedUsers: arrayUnion(userIdToBlock),
      });

      // add curren user id to blocked user 
      const blockedUserRef = doc(db, "users", userIdToBlock);
      await updateDoc(blockedUserRef, {
        blockedUsers: arrayUnion(currentUserId),
      });

      // success message
      setSuccessMessage(` بنجاح ${selectedUser.name} تم حظر  `);

      // hide meesag after 2sec
      setTimeout(() => {
        setShowModel(false); //hide modal after sussece
        setSuccessMessage("");
        window.location.reload(); // refresh app to hide blocked user from user menu 
      }, 2000);
    } catch (error) {
      console.error("Error blocking user: ", error);
    }
  }

  return (
    <div className="fixed top-0 left-0 z-50 h-screen w-full bg-[#0b141ac2] flex justify-center items-center overflow-hidden text-center">
      <div className="flex flex-col justify-center items-start bg-[#3B4A54] text-[#D0D6DA] max-w-[560px] p-6 rounded-sm">
        {successMessage ? (
          <p className="text-gray-400  p-1 rounded-sm">{successMessage}</p> // عرض رسالة النجاح
        ) : (
          <>
            <h2 className="text-end w-full text-xl">
              ؟ {selectedUser.name} هل تريد حظر
            </h2>
            <p className="text-end w-full text-gray-400 mt-1">
              لن تتمكن من رؤية الشخص المحظور أو التواصل معه، وكذلك هو أيضًا.
            </p>
            <div className="flex gap-4 justify-start items-center">
              <button
                onClick={() => blockUser(currentUser.uid, selectedUser.uid)}
                className="bg-[#05bb8e] text-[#111B21] font-bold rounded-full px-[24px] py-[10px] mt-[24px]"
              >
                حظر
              </button>
              <button
                onClick={() => setShowModel(false)}
                className="text-[#05bb8e] font-bold rounded-full px-[24px] py-[10px] mt-[24px] border-[1px] border-gray-500"
              >
                إلغاء
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlockUserModel;
