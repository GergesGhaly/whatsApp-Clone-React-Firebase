import React from "react";

const User = ({ user, handleUserSelect }) => {
  return (
    <div
     
      className="flex items-center w-full overflow-hidden gap-3 p-2 mb-1 shadow hover:bg-[#202C33] cursor-pointer transition-colors"
      onClick={() => handleUserSelect(user)}
    >
      <img src={user.img} alt={user.name} className="w-12 h-12 rounded-full" />
      <div>
        <h2 className="text-lg font-semibold">{user.name}</h2>
        <p className="text-sm text-gray-500 w-full overflow-hidden text-nowrap">
          {user.lastMessage ? `${user.lastMessage.text}` : "No messages"}
        </p>
      </div>
    </div>
  );
};

export default User;
